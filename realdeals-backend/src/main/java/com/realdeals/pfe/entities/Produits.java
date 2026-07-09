package com.realdeals.pfe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "PRODUITS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PROD")
    private Long idProd;

    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Column(name = "DESCRIPTION", columnDefinition = "TEXT")
    private String description;

    @Column(name = "DESCRIPTION_SEO", columnDefinition = "TEXT")
    private String descriptionSeo;

    @Column(name = "PRIX", nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(name = "STOCK", nullable = false)
    private Integer stock = 0;

    @Column(name = "TAILLES", length = 100)
    private String tailles;

    @Column(name = "IMAGE_URL", length = 255)
    private String imageUrl;

    @Column(name = "IMAGE_URLS", columnDefinition = "TEXT")
    private String imageUrls;

    @Column(name = "DATE_CREATION", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateCreation;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CATEG", referencedColumnName = "ID_CATEG")
    private Categories categorie;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonIgnore
    private List<LigneCommande> lignesCommande;

    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (stock == null) {
            stock = 0;
        }
    }
}
