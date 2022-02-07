package rs.devlabs.slozna.zgrada.repos;

import java.util.Optional;
import org.springframework.data.repository.PagingAndSortingRepository;
import rs.devlabs.slozna.zgrada.data.User;


public interface UserRepository extends PagingAndSortingRepository<User, String> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
    
    boolean existsById(int id);
    
    Optional<User> findByApartmentNumber(int apartmentNumber);
}
