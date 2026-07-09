package com.realdeals.pfe.repositories;

import com.realdeals.pfe.entities.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findAllByOrderByDateCreationDesc();

    long countByLuFalse();
}