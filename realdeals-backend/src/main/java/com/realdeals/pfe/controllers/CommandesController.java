package com.realdeals.pfe.controllers;

import com.realdeals.pfe.entities.Orders;
import com.realdeals.pfe.entities.Utilisateurs;
import com.realdeals.pfe.repositories.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.realdeals.pfe.entities.Notification;
import com.realdeals.pfe.repositories.NotificationRepository;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
public class CommandesController {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody Orders order,
            Authentication authentication) {

        if (authentication == null || !(authentication.getPrincipal() instanceof Utilisateurs user)) {
            return ResponseEntity.status(401).build();
        }
        order.setUtilisateur(user);

        if (order.getStatut() == null) {
            order.setStatut(Orders.Statut.EN_ATTENTE);
        }

        if (order.getLignesCommande() != null) {
            order.getLignesCommande().forEach(ligne -> ligne.setOrder(order));
        }

        Orders saved = ordersRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("idOrder", saved.getIdOrder());
        response.put("statut", saved.getStatut());
        response.put("total", saved.getTotal());
        response.put("dateCreation", saved.getDateCreation());
        response.put("modePaiement", saved.getModePaiement());
        response.put("phoneNumber", saved.getPhoneNumber());
        response.put("shippingAddress", saved.getShippingAddress());

        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {
        List<Orders> orders = ordersRepository.findAll();

        List<Map<String, Object>> result = orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("idOrder", order.getIdOrder());
            map.put("statut", order.getStatut());
            map.put("total", order.getTotal());
            map.put("dateCreation", order.getDateCreation());
            map.put("modePaiement", order.getModePaiement());
            map.put("phoneNumber", order.getPhoneNumber());
            map.put("shippingAddress", order.getShippingAddress());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable Long id) {
        Optional<Orders> optionalOrder = ordersRepository.findById(id);

        if (optionalOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Orders order = optionalOrder.get();

        Map<String, Object> map = new HashMap<>();
        map.put("idOrder", order.getIdOrder());
        map.put("statut", order.getStatut());
        map.put("total", order.getTotal());
        map.put("dateCreation", order.getDateCreation());
        map.put("modePaiement", order.getModePaiement());
        map.put("phoneNumber", order.getPhoneNumber());
        map.put("shippingAddress", order.getShippingAddress());

        return ResponseEntity.ok(map);
    }

    @GetMapping("/user/{idUtilisateur}")
    public ResponseEntity<List<Map<String, Object>>> getOrdersByUser(
            @PathVariable Long idUtilisateur,
            Authentication authentication) {

        Utilisateurs user = (Utilisateurs) authentication.getPrincipal();
        if (!user.getIdUtilisateur().equals(idUtilisateur) && user.getRole() != Utilisateurs.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        List<Orders> orders = ordersRepository.findByUtilisateur_IdUtilisateur(idUtilisateur);

        List<Map<String, Object>> result = orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("idOrder", order.getIdOrder());
            map.put("statut", order.getStatut());
            map.put("total", order.getTotal());
            map.put("dateCreation", order.getDateCreation());
            map.put("modePaiement", order.getModePaiement());
            map.put("phoneNumber", order.getPhoneNumber());
            map.put("shippingAddress", order.getShippingAddress());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSalesStats(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        List<Orders> allOrders = ordersRepository.findAll();

        List<Orders> filtered = allOrders.stream()
                .filter(o -> {
                    if (from == null && to == null) return true;

                    LocalDate orderDate = o.getDateCreation().toLocalDate();

                    if (from != null && orderDate.isBefore(LocalDate.parse(from))) return false;
                    if (to != null && orderDate.isAfter(LocalDate.parse(to))) return false;

                    return true;
                })
                .collect(Collectors.toList());

        BigDecimal totalRevenue = filtered.stream()
                .map(Orders::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("orderCount", filtered.size());

        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Optional<Orders> optionalOrder = ordersRepository.findById(id);

        if (optionalOrder.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Orders order = optionalOrder.get();

        try {
            Orders.Statut oldStatus = order.getStatut();
            Orders.Statut newStatus = Orders.Statut.valueOf(body.get("statut"));

            order.setStatut(newStatus);
            Orders updated = ordersRepository.save(order);

            if (oldStatus != newStatus) {
                Notification notification = new Notification();
                notification.setTitre("Order update");
                notification.setMessage(getNotificationMessage(updated.getIdOrder(), newStatus));
                notification.setUtilisateur(updated.getUtilisateur());
                notification.setOrder(updated);
                notificationRepository.save(notification);
            }

            Map<String, Object> map = new HashMap<>();
            map.put("idOrder", updated.getIdOrder());
            map.put("statut", updated.getStatut());
            map.put("total", updated.getTotal());
            map.put("dateCreation", updated.getDateCreation());
            map.put("modePaiement", updated.getModePaiement());
            map.put("phoneNumber", updated.getPhoneNumber());
            map.put("shippingAddress", updated.getShippingAddress());

            return ResponseEntity.ok(map);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String getNotificationMessage(Long orderId, Orders.Statut status) {
        return switch (status) {
            case EN_ATTENTE -> "Your order #" + orderId + " is waiting for confirmation.";
            case CONFIRMEE -> "Your order #" + orderId + " has been confirmed.";
            case EXPEDIEE -> "Your order #" + orderId + " has been shipped.";
            case LIVREE -> "Your order #" + orderId + " has been delivered.";
            case ANNULEE -> "Your order #" + orderId + " has been cancelled.";
        };
    }
}