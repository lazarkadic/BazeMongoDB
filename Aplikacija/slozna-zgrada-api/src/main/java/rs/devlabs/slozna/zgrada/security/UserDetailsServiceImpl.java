//package rs.devlabs.slozna.zgrada.security;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//import java.util.Set;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import rs.devlabs.slozna.zgrada.data.Role;
//import rs.devlabs.slozna.zgrada.data.User;
//import rs.devlabs.slozna.zgrada.repos.UserRepository;
//
//
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    @Autowired
//    private UserRepository repo;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        Optional<User> optUser = repo.findByUsername(username);
//        if (optUser.isPresent()) {
//            User user = optUser.get();
//            return new UserDetailsImpl(user.getUsername(), user.getPassword(), buildSimpleGrantedAuthorities(user.getRoles()));
//        } else {
//            throw new UsernameNotFoundException("User not found with username: " + username);
//        }
//    }
//
//    private List<SimpleGrantedAuthority> buildSimpleGrantedAuthorities(final Set<Role> roles) {
//        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
//        roles.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name())));
//        return authorities;
//    }
//}
