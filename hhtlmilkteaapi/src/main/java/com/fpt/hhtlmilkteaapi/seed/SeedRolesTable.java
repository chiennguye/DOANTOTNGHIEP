package com.fpt.hhtlmilkteaapi.seed;

import com.fpt.hhtlmilkteaapi.config.ERole;
import com.fpt.hhtlmilkteaapi.entity.Role;
import com.fpt.hhtlmilkteaapi.repository.IRoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class SeedRolesTable {

    private static final Logger LOGGER = LoggerFactory.getLogger(SeedRolesTable.class);

    private static IRoleRepository roleRepository;

    public SeedRolesTable(IRoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public static void insertData() {
        long count = roleRepository.count();
        if (count == 0) {
            // Insert Roles
            Role role01 = new Role(ERole.ROLE_ADMIN);
            Role role02 = new Role(ERole.ROLE_USER);
            Role role03 = new Role(ERole.ROLE_SHIPPER);

            // Insert Data
            roleRepository.saveAll(Arrays.asList(role01, role02, role03));
            LOGGER.info("Roles Table Seeded.");
        } else {
            // Check if ROLE_SHIPPER exists
            if (!roleRepository.findByName(ERole.ROLE_SHIPPER).isPresent()) {
                Role role03 = new Role(ERole.ROLE_SHIPPER);
                roleRepository.save(role03);
                LOGGER.info("ROLE_SHIPPER added to Roles Table.");
            }
            LOGGER.trace("Roles Seeding Not Required.");
        }
    }

}
