package rs.devlabs.slozna.zgrada.controllers;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.devlabs.slozna.zgrada.data.Poll;
import rs.devlabs.slozna.zgrada.data.PollTransfer;
import rs.devlabs.slozna.zgrada.repos.PollRepository;
import rs.devlabs.slozna.zgrada.utils.Utils;


@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/poll")
public class PollController {

    @Autowired
    private PollRepository repo;
    @Autowired
    private Utils utils;

    @GetMapping
    public ResponseEntity<List<Poll>> getAll() {
        try {
            Iterable<Poll> it = repo.findAll();
            List<Poll> polls = new ArrayList<>();
            it.forEach(polls::add);
            return new ResponseEntity<>(polls, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Poll> create(Principal principal, @RequestBody PollTransfer transfer) {
        try {
            Optional<String> optUserId = utils.getUserId(principal);
            if (optUserId.isPresent()) {
                if (transfer != null) {
                    Poll dbPoll = new Poll(transfer, optUserId.get());
                    dbPoll = repo.save(dbPoll);
                    return new ResponseEntity<>(dbPoll, HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(null, HttpStatus.NOT_MODIFIED);
                }
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{id}/{answ}/{userId}")
    public ResponseEntity<Poll> update(@PathVariable("id") String id, @PathVariable("answ") String answ, @PathVariable("userId") String userId) {
        try {
            Optional<Poll> optPoll = repo.findById(id);
            if (optPoll.isPresent()) {
                Poll poll = optPoll.get();
                List<String> usrIds = poll.getUserIdList();
                if(!usrIds.contains(userId)){
                    usrIds.add(userId);
                    Map<String, Integer> newAnswers = new HashMap<>();
                    newAnswers = poll.getAnswers();
                    int pom = newAnswers.getOrDefault(answ, 0);
                    pom++;
                    newAnswers.replace(answ, pom);
                    poll.setAnswers(newAnswers);
                    poll = repo.save(poll);
                    return new ResponseEntity<>(poll, HttpStatus.OK);
                }
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable("id") String id) {
        try {
            repo.deleteById(id);
            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
