package com.realdeals.pfe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "NOTIFICATIONS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_NOTIFICATION")
    private Long idNotification;

    @Column(name = "TITRE", nullable = false, length = 100)
    private String titre;

    @Column(name = "MESSAGE", nullable = false, length = 255)
    private String message;

    @Column(name = "LU", nullable = false)
    private Boolean lu = false;

    @Column(name = "DATE_CREATION", nullable = false)
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_UTILISATEUR", nullable = false)
    @JsonIgnore
    private Utilisateurs utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ORDER")
    @JsonIgnore
    private Orders order;

    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (lu == null) {
            lu = false;
        }
    }
}