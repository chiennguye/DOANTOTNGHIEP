package com.fpt.hhtlmilkteaapi.controller;

import com.fpt.hhtlmilkteaapi.entity.Notification;
import com.fpt.hhtlmilkteaapi.repository.INotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

    @Autowired
    private INotificationRepository notificationRepository;

    @GetMapping("/unread")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHIPPER')")
    public ResponseEntity<?> getUnreadNotifications(@RequestParam String role) {
        // Validate role
        if (!role.equals("ADMIN") && !role.equals("SHIPPER")) {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        List<Notification> notifications = notificationRepository
                .findByRecipientRoleAndIsReadFalseOrderByTimestampDesc(role);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHIPPER')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHIPPER')")
    public ResponseEntity<?> getUnreadCount(@RequestParam String role) {
        // Validate role
        if (!role.equals("ADMIN") && !role.equals("SHIPPER")) {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        long count = notificationRepository.findByRecipientRoleAndIsReadFalseOrderByTimestampDesc(role).size();
        return ResponseEntity.ok(count);
    }
}