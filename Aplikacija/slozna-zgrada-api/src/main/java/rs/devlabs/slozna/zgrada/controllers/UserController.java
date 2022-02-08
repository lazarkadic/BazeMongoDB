package rs.devlabs.slozna.zgrada.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
import rs.devlabs.slozna.zgrada.data.User;
import rs.devlabs.slozna.zgrada.repos.UserRepository;


@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository repo;

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        try {
            Iterable<User> it = repo.findAll();
            List<User> users = new ArrayList<>();
            it.forEach(users::add);
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable("id") String id) {
        try {
            Optional<User> optUser = repo.findById(id);
            if (optUser.isPresent()) {
                return new ResponseEntity<>(optUser.get(), HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/u/{username}")
    public ResponseEntity<User> findByUsername(@PathVariable("username") String username) {
        try {
            Optional<User> optUser = repo.findByUsername(username);
            if (optUser.isPresent()) {
                return new ResponseEntity<>(optUser.get(), HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/a/{apartmentNumber}")
    public ResponseEntity<User> findByApartmentNumber(@PathVariable("apartmentNumber") int apartmentNumber) {
        try {
            Optional<User> optUser = repo.findByApartmentNumber(apartmentNumber);
            if (optUser.isPresent()) {
                return new ResponseEntity<>(optUser.get(), HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        try {
            if (!repo.existsByUsername(user.getUsername())) {
                user.setId(UUID.randomUUID().toString());
                user.setPassword(user.getPassword());
                user = repo.save(user);
                return new ResponseEntity<>(user, HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_MODIFIED);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable("id") String id, @RequestBody User user) {
        try {
            Optional<User> optUser = repo.findById(id);
            if (optUser.isPresent()) {
                user.setId(id);
                user.setPassword(user.getPassword());
                user = repo.save(user);
                return new ResponseEntity<>(user, HttpStatus.CREATED);
            }

            return new ResponseEntity<>(user, HttpStatus.NOT_FOUND);
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
