package com.realdeals.pfe.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "LIGNECOMMANDE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_LIGNE_COMMANDE")
    private Long idLigneCommande;

    @Column(name = "QUANTITE", nullable = false)
    private Integer quantite = 1;

    @Column(name = "PRIX_UNITAIRE", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ORDER", referencedColumnName = "ID_ORDER", nullable = false)
    @JsonBackReference
    private Orders order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROD", referencedColumnName = "ID_PROD", nullable = false)
    private Produits produit;

    @PrePersist
    protected void onCreate() {
        if (quantite == null) {
            quantite = 1;
        }
    }
}