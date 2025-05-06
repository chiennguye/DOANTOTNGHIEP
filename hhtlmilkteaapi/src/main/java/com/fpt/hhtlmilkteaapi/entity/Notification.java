package com.fpt.hhtlmilkteaapi.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;
    private String type; // new_order, shipping, completed
    private String message;
    private Date timestamp;
    private boolean isRead;
    private String recipientRole; // ADMIN, SHIPPER

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Notification(String orderId, String type, String message, String recipientRole, User user) {
        this.orderId = orderId;
        this.type = type;
        this.message = message;
        this.timestamp = new Date();
        this.isRead = false;
        this.recipientRole = recipientRole;
        this.user = user;
    }
}