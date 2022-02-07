package rs.devlabs.slozna.zgrada.repos;

import java.util.Optional;
import org.springframework.data.repository.PagingAndSortingRepository;
import rs.devlabs.slozna.zgrada.data.Notification;


public interface NotificationRepository extends PagingAndSortingRepository<Notification, String> {

    Optional<Notification> findByUserId(String userId);
}
