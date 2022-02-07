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
import rs.devlabs.slozna.zgrada.data.Debt;
import rs.devlabs.slozna.zgrada.repos.DebtRepository;
import rs.devlabs.slozna.zgrada.repos.UserRepository;
import rs.devlabs.slozna.zgrada.utils.Utils;


@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/debt")
public class DebtController {

    @Autowired
    private DebtRepository repo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private Utils utils;

    @GetMapping
    public ResponseEntity<List<Debt>> getAll() {
        try {
            Iterable<Debt> it = repo.findAll();
            List<Debt> debts = new ArrayList<>();
            it.forEach(debts::add);
            return new ResponseEntity<>(debts, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Debt> getById(@PathVariable("id") String id) {
        try {
            Optional<Debt> optDebt = repo.findById(id);
            if (optDebt.isPresent()) {
                return new ResponseEntity<>(optDebt.get(), HttpStatus.OK);
            }
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Debt> create(@RequestBody Debt debt) {
        try {
            if (debt != null) {
                boolean exists = userRepo.existsById(debt.getUserId());
                if (exists) {
                    Optional<Debt> optDebt = repo.findByUserId(debt.getUserId());
                    if (optDebt.isEmpty()) {
                        debt.setId(UUID.randomUUID().toString());
                        debt = repo.save(debt);
                        return new ResponseEntity<>(debt, HttpStatus.CREATED);
                    }else {
                        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
                    } 
                } else {
                    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_MODIFIED);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Debt> debtEdit(@PathVariable("id") String id, @RequestBody Debt debt) {
        try {
            Optional<Debt> optDebt = repo.findById(id);
            if (optDebt.isPresent()) {
                Debt debtOld = optDebt.get();
                debtOld.setElectricity(debt.getElectricity());
                debtOld.setWater(debt.getWater());
                debtOld.setUnitedBills(debt.getUnitedBills());
                debtOld.setBuildingBills(debt.getBuildingBills());
                debtOld.setOther(debt.getOther());
                debtOld = repo.save(debtOld);
                return new ResponseEntity<>(debtOld, HttpStatus.OK);
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
