package com.realdeals.pfe.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "ADRESSE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Adresse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ADRESS")
    private Long idAdress;

    @Column(name = "VILLE", nullable = false, length = 150)
    private String ville;

    @Column(name = "RUE", nullable = false, length = 255)
    private String rue;

    @Column(name = "CODE_POSTAL", length = 20)
    private String codePostal;

    // Relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_UTILISATEUR", referencedColumnName = "ID_UTILISATEUR", nullable = false)
    private Utilisateurs utilisateur;
}