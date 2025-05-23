package com.fpt.hhtlmilkteaapi.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.hhtlmilkteaapi.entity.*;
import com.fpt.hhtlmilkteaapi.payload.request.*;
import com.fpt.hhtlmilkteaapi.payload.response.CartResponse;
import com.fpt.hhtlmilkteaapi.payload.response.MemberVipResponse;
import com.fpt.hhtlmilkteaapi.payload.response.MessageResponse;
import com.fpt.hhtlmilkteaapi.repository.*;
import com.fpt.hhtlmilkteaapi.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import com.fpt.hhtlmilkteaapi.entity.Order;
import com.fpt.hhtlmilkteaapi.entity.User;
import com.fpt.hhtlmilkteaapi.repository.IOrderRepository;
import com.fpt.hhtlmilkteaapi.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Arrays;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IOrderDetailRepository orderDetailRepository;

    @Autowired
    private IMemberVipRepository memberVipRepository;

    @Autowired
    private IShorterRepository shorterRepository;

    @Autowired
    private IGroupMemberRepository groupMemberRepository;

    @Autowired
    private IProductInventoryRepository productInventoryRepository;

    @Autowired
    private IOrderService orderService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private INotificationRepository notificationRepository;

    @GetMapping("/list")
    public ResponseEntity<?> getOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOrder(@PathVariable long id) {
        CartResponse cartResponse = new CartResponse();

        Order order = orderRepository.findOrderByUserId_IdAndStatusLike(id, 0, Sort.by(Sort.Direction.DESC, "id"));
        if (order != null) {
            int sum = 0;
            for (OrderDetail orderDetailnew : order.getOrderDetails()) {
                sum += orderDetailnew.getQuantity();
            }

            long total = 0;
            for (OrderDetail orderDetailnew : order.getOrderDetails()) {
                total += (orderDetailnew.getPriceCurrent() * orderDetailnew.getQuantity());
            }

            cartResponse.setTotalPrice(total);
            cartResponse.setOrder(order);
            cartResponse.setQuantity(sum);
        }
        return ResponseEntity.ok(cartResponse);
    }

    @PostMapping("")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addOrder(@RequestBody OrderRequest orderRequest) throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        SimpleDateFormat formatter = new SimpleDateFormat("ddMyyyyhhmmss");

        CartResponse cartResponse = new CartResponse();

        long id = orderRequest.getUserId();

        Order order = orderRepository.findOrderByUserId_IdAndStatusLike(id, 0, Sort.by(Sort.Direction.DESC, "id"));

        User user = userRepository.findById(id).get();
        Product product = objectMapper.readValue(orderRequest.getProduct().toString(), Product.class);
        String note = orderRequest.getNote();
        String size = orderRequest.getSizeOption();
        String add = orderRequest.getAdditionOption();
        int quantity = orderRequest.getQuantity();
        long currenPrice = orderRequest.getPriceCurrent();

        // Kiểm tra oder
        Order orderNew;
        if (order != null) {
            orderNew = order;
        } else {
            String orderId = "O" + formatter.format(new Date());
            orderNew = new Order(orderId, null, null, 0, 0, null, 0, user, 0, 0);
            orderNew.setCreatedAt(new Date());
            orderNew.setUpdatedAt(new Date());
            orderNew.setTeam(true);
            orderRepository.save(orderNew);
        }

        // Tạo OrderDetail
        // Check neu orderdetail co product, add, size giong nhau thi cong quantity

        if (orderNew.getOrderDetails() != null) {

            OrderDetail orderDetail = orderDetailRepository
                    .findByOrderId_IdAndProduct_IdAndAddOptionIdLikeAndSizeOptionIdLike(orderNew.getId(),
                            product.getId(), add, size);

            if (orderDetail != null) {
                orderDetail.setQuantity(orderDetail.getQuantity() + quantity);
                orderDetail.setNoteProduct(note);
                orderDetailRepository.save(orderDetail);
                orderNew.setOrderDetails(orderDetailRepository.findByOrderId_Id(orderNew.getId()));
                orderRepository.save(orderNew);

                int sum = 0;
                for (OrderDetail orderDetailnew : orderNew.getOrderDetails()) {
                    sum += orderDetailnew.getQuantity();
                }

                long total = 0;
                for (OrderDetail orderDetailnew : orderNew.getOrderDetails()) {
                    total += (orderDetailnew.getPriceCurrent() * orderDetailnew.getQuantity());
                }

                cartResponse.setTotalPrice(total);
                cartResponse.setOrder(orderNew);
                cartResponse.setQuantity(sum);
            } else {
                OrderDetail orderDetailNew = new OrderDetail(size, add, quantity, currenPrice,
                        note, orderNew, product);
                orderDetailRepository.save(orderDetailNew);
                orderNew.setOrderDetails(orderDetailRepository.findByOrderId_Id(orderNew.getId()));
                orderRepository.save(orderNew);

                int sum = 0;
                for (OrderDetail orderDetailnew : orderNew.getOrderDetails()) {
                    sum += orderDetailnew.getQuantity();
                }

                long total = 0;
                for (OrderDetail orderDetailnew : orderNew.getOrderDetails()) {
                    total += (orderDetailnew.getPriceCurrent() * orderDetailnew.getQuantity());
                }

                cartResponse.setTotalPrice(total);
                cartResponse.setOrder(orderNew);
                cartResponse.setQuantity(sum);
            }
            return ResponseEntity.ok(cartResponse);
        } else {
            OrderDetail orderDetailNew = new OrderDetail(size, add, quantity, currenPrice,
                    note, orderNew, product);
            orderDetailRepository.save(orderDetailNew);

            orderNew.setOrderDetails(orderDetailRepository.findByOrderId_Id(orderNew.getId()));
            orderRepository.save(orderNew);

            int sum = 0;
            for (OrderDetail orderDetail : orderNew.getOrderDetails()) {
                sum += orderDetail.getQuantity();
            }

            long total = 0;
            for (OrderDetail orderDetailnew : orderNew.getOrderDetails()) {
                total += (orderDetailnew.getPriceCurrent() * orderDetailnew.getQuantity());
            }

            cartResponse.setTotalPrice(total);
            cartResponse.setOrder(orderNew);
            cartResponse.setQuantity(sum);
            return ResponseEntity.ok(cartResponse);
        }
    }

    @GetMapping("/listProcess")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getListProcess(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "-1") long id) {

        Pageable pageable = PageRequest.of(
                page - 1, pageSize,
                "asc".equals(sortDir) ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());

        if (id == -1) {
            Page<Order> orders = orderRepository.findAllByStatusIn(Arrays.asList(1, 2), pageable);
            return ResponseEntity.ok(orders);
        }

        Optional<User> user = userRepository.findById(id);

        Page<Order> orders = orderRepository.findAllByUserIdEqualsAndStatusIn(user, Arrays.asList(1, 2), pageable);

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/listSuccess")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getListSuccess(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "-1") long id) {

        Pageable pageable = PageRequest.of(
                page - 1, pageSize,
                "asc".equals(sortDir) ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());

        if (id == -1) {
            Page<Order> orders = orderRepository.findAllByStatusIn(Arrays.asList(3), pageable);
            return ResponseEntity.ok(orders);
        }

        Optional<User> user = userRepository.findById(id);

        Page<Order> orders = orderRepository.findAllByUserIdEqualsAndStatusIn(user, Arrays.asList(3), pageable);

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/listFail")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getListFail(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "-1") long id) {

        Pageable pageable = PageRequest.of(
                page - 1, pageSize,
                "asc".equals(sortDir) ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());

        if (id == -1) {
            Page<Order> orders = orderRepository.findAllByStatusIn(Arrays.asList(4), pageable);
            return ResponseEntity.ok(orders);
        }

        Optional<User> user = userRepository.findById(id);

        Page<Order> orders = orderRepository.findAllByUserIdEqualsAndStatusIn(user, Arrays.asList(4), pageable);

        return ResponseEntity.ok(orders);

    }

    @PutMapping("")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateQuantity(
            @RequestBody OrderQuantityRequest orderQuantityRequest) {
        CartResponse cartResponse = new CartResponse();
        OrderDetail orderDetail = orderDetailRepository.findById(orderQuantityRequest.getOrderDetailId()).get();
        Order order = orderRepository.findById(orderDetail.getOrderId().getId()).get();

        if (orderQuantityRequest.getAction().equals("plus")) {
            orderDetail.setQuantity(orderDetail.getQuantity() + 1);
            orderDetailRepository.save(orderDetail);
        } else {
            orderDetail.setQuantity(orderDetail.getQuantity() - 1);
            orderDetailRepository.save(orderDetail);
        }
        order.setOrderDetails(orderDetailRepository.findByOrderId_Id(order.getId()));

        int sum = 0;
        for (OrderDetail orderDetailnew : order.getOrderDetails()) {
            sum += orderDetailnew.getQuantity();
        }

        long total = 0;
        for (OrderDetail orderDetailnew : order.getOrderDetails()) {
            total += (orderDetailnew.getPriceCurrent() * orderDetailnew.getQuantity());
        }

        cartResponse.setTotalPrice(total);
        cartResponse.setOrder(order);
        cartResponse.setQuantity(sum);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateQuantity(@PathVariable long id) {
        CartResponse cartResponse = new CartResponse();
        OrderDetail orderDetail = orderDetailRepository.findById(id).get();
        Order order = orderRepository.findById(orderDetail.getOrderId().getId()).get();

        orderDetailRepository.delete(orderDetail);

        order.setOrderDetails(orderDetailRepository.findByOrderId_Id(order.getId()));

        int sum = 0;
        for (OrderDetail orderDetailnew : order.getOrderDetails()) {
            sum += orderDetailnew.getQuantity();
        }

        long total = 0;
        for (OrderDetail orderDetailnew : order.getOrderDetails()) {
            total += (orderDetailnew.getPriceCurrent() * orderDetailnew.getQuantity());
        }

        cartResponse.setTotalPrice(total);
        cartResponse.setOrder(order);
        cartResponse.setQuantity(sum);
        return ResponseEntity.ok(cartResponse);
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@RequestBody OrderStatusRequest orderStatusRequest) {
        try {
            Order order = orderService.updateStatus(orderStatusRequest);

            // Create notification based on status
            Map<String, Object> notification = new HashMap<>();
            notification.put("timestamp", new Date().getTime());
            notification.put("orderId", order.getId());
            notification.put("recipientRole", "ADMIN"); // Add recipient role

            switch (orderStatusRequest.getStatus()) {
                case 1: // New order
                    notification.put("type", "new_order");
                    notification.put("message", "Có đơn hàng mới");
                    // Save notification for admin
                    notificationRepository.save(new Notification(
                            String.valueOf(order.getId()),
                            "new_order",
                            "Có đơn hàng mới",
                            "ADMIN",
                            null));
                    break;
                case 2: // Shipping
                    notification.put("type", "shipping");
                    notification.put("message", "Đơn hàng đang được giao");
                    // Save notification for shipper
                    notificationRepository.save(new Notification(
                            String.valueOf(order.getId()),
                            "shipping",
                            "Đơn hàng cần giao",
                            "SHIPPER",
                            null));
                    break;
                case 3: // Completed
                    notification.put("type", "completed");
                    notification.put("message", "Đơn hàng đã giao thành công");
                    // Save notification for admin
                    notificationRepository.save(new Notification(
                            String.valueOf(order.getId()),
                            "completed",
                            "Đơn hàng đã giao thành công",
                            "ADMIN",
                            null));
                    break;
            }

            // Send notification to all admin users
            messagingTemplate.convertAndSend("/message", notification);

            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/checkout")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest checkoutRequest) {

        if (!orderRepository.existsById(checkoutRequest.getOrderId())) {
            return ResponseEntity.ok(new MessageResponse("Bad Request"));
        }

        // find order
        Order order = orderRepository.findById(checkoutRequest.getOrderId()).get();

        // get value
        String address = checkoutRequest.getAddress();
        String phone = checkoutRequest.getPhone();
        int payment = "cod".equals(checkoutRequest.getPayment()) ? 1 : 2;
        int shipping = checkoutRequest.getShipping();
        String note = checkoutRequest.getNote();

        // Update order
        if (payment == 1) {
            order.setStatus(1);
        } else {
            order.setStatus(2);
        }
        order.setNotification(1);
        order.setAddress(address);
        order.setNoteOrder(note);
        order.setPhone(phone);
        order.setPayment(payment);
        order.setTotalPrice(checkoutRequest.getTotalPrice());
        order.setShipping(shipping);
        order.setCreatedAt(new Date());
        order.setMemberVip(checkoutRequest.getMemberVip());
        orderRepository.save(order);

        // Update memberVip
        User user = userRepository.findById(order.getUserId().getId()).get();
        MemberVip memberVip = user.getMemberVip();
        if (memberVip == null) {
            memberVip = new MemberVip(0, user);
        }

        if (payment == 2) {
            memberVip
                    .setMark(memberVip.getMark() + (checkoutRequest.getTotal() / 100) - checkoutRequest.getMemberVip());
        } else {
            memberVip.setMark(memberVip.getMark() - checkoutRequest.getMemberVip());
        }

        memberVipRepository.save(memberVip);

        user.setMemberVip(memberVip);
        userRepository.save(user);

        MemberVipResponse memberVipResponse = new MemberVipResponse();
        memberVipResponse.setUser(user);

        // Delete long url
        List<Shorter> shorters = shorterRepository.findAllByLongUrlLike("%" + checkoutRequest.getOrderId() + "%");
        if (shorters.size() > 0) {
            shorterRepository.delete(shorters.get(0));
        }

        // Delete member not group
        if (!checkoutRequest.isTeam()) {
            List<GroupMember> groupMembers = groupMemberRepository.findAllByOrder(order);
            if (groupMembers.size() > 0) {
                groupMemberRepository.deleteAll(groupMembers);
            }
        }

        return ResponseEntity.ok(memberVipResponse);
    }
}
