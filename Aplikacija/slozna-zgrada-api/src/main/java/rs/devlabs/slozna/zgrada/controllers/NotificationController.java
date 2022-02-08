package rs.devlabs.slozna.zgrada.controllers;

import java.security.Principal;
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
import rs.devlabs.slozna.zgrada.data.Notification;
import rs.devlabs.slozna.zgrada.repos.NotificationRepository;
import rs.devlabs.slozna.zgrada.repos.UserRepository;
import rs.devlabs.slozna.zgrada.data.User;


@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationRepository repo;
    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public ResponseEntity<List<Notification>> getAll() {
        try {
            Iterable<Notification> it = repo.findAll();
            List<Notification> notifications = new ArrayList<>();
            it.forEach(notifications::add);
            return new ResponseEntity<>(notifications, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Notification> create(Principal principal, @RequestBody Notification notification) {
        try {
            Optional<User> optUser = userRepo.findByUsername(principal.getName());
            if (optUser.isPresent()) {
                if (notification != null) {
                    notification.setId(UUID.randomUUID().toString());
                    notification.setCreated(System.currentTimeMillis());
                    notification.setUserId(optUser.get().getId());
                    notification.setLikes(0);
                    notification = repo.save(notification);
                    return new ResponseEntity<>(notification, HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(null, HttpStatus.NOT_MODIFIED);
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

    @PutMapping("/{id}")
    public ResponseEntity<Notification> like(@PathVariable("id") String id) {
        try {
            Optional<Notification> optNotification = repo.findById(id);
            if (optNotification.isPresent()) {
                Notification notification = optNotification.get();
                notification.setLikes(notification.getLikes() + 1);
                notification = repo.save(notification);
                return new ResponseEntity<>(notification, HttpStatus.OK);
            }

            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
