package com.fpt.hhtlmilkteaapi.repository;

import com.fpt.hhtlmilkteaapi.entity.WheelHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface IWheelHistoryRepository extends JpaRepository<WheelHistory, Long> {
    long countByFullNameAndCreatedAtBetween(String fullName, Date startDate, Date endDate);
}
