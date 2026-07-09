package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.Notification;
import com.realdeals.pfe.entities.Utilisateurs;
import com.realdeals.pfe.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/me")
    public ResponseEntity<List<Map<String, Object>>> getMyNotifications(Authentication authentication) {
        Utilisateurs user = (Utilisateurs) authentication.getPrincipal();

        List<Notification> notifications =
                notificationRepository.findByUtilisateur_IdUtilisateurOrderByDateCreationDesc(user.getIdUtilisateur());

        List<Map<String, Object>> result = notifications.stream().map(n -> {
            Map<String, Object> map = new HashMap<>();
            map.put("idNotification", n.getIdNotification());
            map.put("titre", n.getTitre());
            map.put("message", n.getMessage());
            map.put("lu", n.getLu());
            map.put("dateCreation", n.getDateCreation());
            map.put("idOrder", n.getOrder() != null ? n.getOrder().getIdOrder() : null);
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(Authentication authentication) {
        Utilisateurs user = (Utilisateurs) authentication.getPrincipal();

        long count = notificationRepository
                .countByUtilisateur_IdUtilisateurAndLuFalse(user.getIdUtilisateur());

        Map<String, Object> response = new HashMap<>();
        response.put("count", count);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Authentication authentication) {
        Utilisateurs user = (Utilisateurs) authentication.getPrincipal();

        return notificationRepository.findById(id)
                .map(notification -> {
                    if (!notification.getUtilisateur().getIdUtilisateur().equals(user.getIdUtilisateur())) {
                        return ResponseEntity.status(403).<Void>build();
                    }

                    notification.setLu(true);
                    notificationRepository.save(notification);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}