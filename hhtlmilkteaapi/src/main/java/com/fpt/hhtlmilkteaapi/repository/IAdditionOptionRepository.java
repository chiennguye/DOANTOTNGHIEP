package com.fpt.hhtlmilkteaapi.repository;

import com.fpt.hhtlmilkteaapi.entity.AdditionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAdditionOptionRepository extends JpaRepository<AdditionOption, Long> {
    AdditionOption findByName(String name);
} 