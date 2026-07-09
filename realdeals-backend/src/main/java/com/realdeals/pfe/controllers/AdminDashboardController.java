package com.realdeals.pfe.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<Map<String, Object>>> getUtilisateurs() {
        String sql = """
            SELECT
                ID_UTILISATEUR AS idUtilisateur,
                NAME AS name,
                EMAIL AS email,
                ROLE AS role,
                DATE_CREATION AS dateCreation
                FROM utilisateurs
                ORDER BY DATE_CREATION DESC
        """;

        return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
    }

    @GetMapping("/clients")
    public ResponseEntity<List<Map<String, Object>>> getClients() {
        String sql = """
            SELECT
                ID_UTILISATEUR AS idUtilisateur,
                NAME AS name,
                EMAIL AS email,
                ROLE AS role,
                DATE_CREATION AS dateCreation
            FROM utilisateurs
            WHERE ROLE = 'CUSTOMER'
            ORDER BY DATE_CREATION DESC
        """;

        return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
    }

    @GetMapping("/commandes")
    public ResponseEntity<List<Map<String, Object>>> getCommandes() {
        String sql = """
            SELECT
                o.ID_ORDER AS idOrder,
                o.STATUT AS statut,
                o.TOTAL AS total,
                o.DATE_CREATION AS dateCreation,
                o.MODE_PAIEMENT AS modePaiement,
                o.PHONE_NUMBER AS phoneNumber,
                o.SHIPPING_ADDRESS AS shippingAddress,
                o.ID_UTILISATEUR AS idUtilisateur,
                u.NAME AS clientName,
                u.EMAIL AS clientEmail
            FROM orders o
            LEFT JOIN utilisateurs u ON o.ID_UTILISATEUR = u.ID_UTILISATEUR
            ORDER BY o.DATE_CREATION DESC
        """;

        return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        StringBuilder sql = new StringBuilder("""
            SELECT
                COALESCE(SUM(TOTAL), 0) AS totalRevenue,
                COUNT(*) AS orderCount
            FROM orders
            WHERE 1 = 1
        """);

        if (from != null && !from.isBlank()) {
            sql.append(" AND DATE(DATE_CREATION) >= '").append(from).append("'");
        }

        if (to != null && !to.isBlank()) {
            sql.append(" AND DATE(DATE_CREATION) <= '").append(to).append("'");
        }

        return ResponseEntity.ok(jdbcTemplate.queryForMap(sql.toString()));
    }
}
