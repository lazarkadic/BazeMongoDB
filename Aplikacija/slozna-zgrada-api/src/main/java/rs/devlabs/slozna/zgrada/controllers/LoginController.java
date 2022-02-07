package rs.devlabs.slozna.zgrada.controllers;

import java.util.Optional;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import rs.devlabs.slozna.zgrada.data.User;
import rs.devlabs.slozna.zgrada.repos.UserRepository;


@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/login")
public class LoginController {

    private static final Logger LOGGER = Logger.getLogger(LoginController.class.getName());

    @Autowired
    private UserRepository repo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<User> login(@RequestParam("username") String username,
            @RequestParam("password") String password) {
        LOGGER.info(String.format("username: %s, password: %s", username, password));
        try {
            if (username != null && password != null) {
                if (!username.isEmpty() && !password.isEmpty()) {
                    Optional<User> optUser = repo.findByUsername(username);
                    if (optUser.isPresent()) {
                        User user = optUser.get();
                        if (passwordEncoder.matches(password, user.getPassword())) {
                            return new ResponseEntity<>(user, HttpStatus.OK);
                        }
                    }
                }
            }
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
