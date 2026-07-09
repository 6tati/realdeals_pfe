package com.realdeals.pfe.repositories;

import com.realdeals.pfe.entities.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByUtilisateur_IdUtilisateur(Long idUtilisateur);
}
