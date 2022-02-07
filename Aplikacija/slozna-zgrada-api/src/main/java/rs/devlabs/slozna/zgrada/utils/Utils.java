package rs.devlabs.slozna.zgrada.utils;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rs.devlabs.slozna.zgrada.data.User;
import rs.devlabs.slozna.zgrada.repos.UserRepository;


@Service
public class Utils {

    @Autowired
    private UserRepository userRepo;

    public Optional<String> getUserId(Principal principal) {
        if (principal != null) {
            Optional<User> optUser = userRepo.findByUsername(principal.getName());
            if (optUser.isPresent()) {
                return Optional.of(optUser.get().getId());
            }
        }
        return Optional.empty();
    }

    

}
