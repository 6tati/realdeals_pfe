package com.realdeals.pfe.repositories;

import com.realdeals.pfe.entities.ChatConversations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatConversationsRepository extends JpaRepository<ChatConversations, Long> {
    List<ChatConversations> findByUtilisateur_IdUtilisateur(Long idUtilisateur);
}
