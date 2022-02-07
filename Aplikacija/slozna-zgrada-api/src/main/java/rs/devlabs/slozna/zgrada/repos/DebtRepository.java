/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rs.devlabs.slozna.zgrada.repos;

import java.util.Optional;
import org.springframework.data.repository.PagingAndSortingRepository;
import rs.devlabs.slozna.zgrada.data.Debt;

public interface DebtRepository extends PagingAndSortingRepository<Debt, String>{
    Optional<Debt> findByUserId(String userId);
}
