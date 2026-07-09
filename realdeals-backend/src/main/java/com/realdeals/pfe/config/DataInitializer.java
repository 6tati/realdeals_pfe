package com.realdeals.pfe.config;

import com.realdeals.pfe.entities.Utilisateurs;
import com.realdeals.pfe.repositories.UtilisateursRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UtilisateursRepository repo) {
        return args -> {
            if (repo.findByEmail("admin@realdeals.com").isEmpty()) {
                Utilisateurs admin = new Utilisateurs();
                admin.setName("Admin");
                admin.setEmail("admin@realdeals.com");
                admin.setPassword("admin123"); // Only call once
                admin.setRole(Utilisateurs.Role.ADMIN);
                repo.save(admin);
            }
        };
    }
}