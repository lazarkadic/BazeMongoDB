package rs.devlabs.slozna.zgrada.repos;

import java.util.Optional;
import org.springframework.data.repository.PagingAndSortingRepository;
import rs.devlabs.slozna.zgrada.data.Poll;


public interface PollRepository extends PagingAndSortingRepository<Poll, String> {

    Optional<Poll> findByUserId(String userId);
}
