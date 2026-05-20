package server.rem.services;

import lombok.RequiredArgsConstructor;

import org.jspecify.annotations.Nullable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import server.rem.dtos.business.*;
import server.rem.entities.*;
import server.rem.mappers.*;
import server.rem.repositories.*;
import server.rem.utils.exceptions.*;
import server.rem.utils.mail.DynamicMail;
import server.rem.utils.messages.BusinessMessages;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusinessService {
    private final BusinessUserRepository businessUserRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final BusinessMapper businessMapper;
    private final DynamicMail dynamicMail;
    private final AddUserToBusinessMapper addUserToBusinessMapper;
    private final RoleRepository roleRepository;

    public List<BusinessResponse> getAllBusinesses(@Nullable String userId) {
        List<Business> businesses = List.of();
        if (userId != null) {
            Optional<User> user = userRepository.findById(userId);
            if (user.isPresent()) businesses = businessRepository.findAllByOwner(user.get());
        } else {
            businesses = businessRepository.findAll();
        }
        return businessMapper.toBusinessesResponse(businesses);
    }

    @Transactional
    public Business createBusinesses(String ownerId, CreateBusinessRequest dto) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        // user cannot create more than 3 businesses
        List<BusinessUser> ownedBusinesses = owner.getBusinessUsers().stream().filter(b -> b.getRole().getName().equals("OWNER")).collect(Collectors.toList());
        if(ownedBusinesses.size() == 3) throw new ConflictException(BusinessMessages.EXCEED_OWNED_BUSINESS);
        Business business = businessRepository.save(businessMapper.toEntity(dto, owner));
        Role role = roleRepository.findByName("OWNER").orElseThrow(() -> new ResourceNotFoundException("User not found"));
        BusinessUser businessUser = BusinessUser.builder()
                .id(new BusinessUserId(business.getId(), ownerId))
                .isVerified(true)
                .business(business)
                .salary(0)
                .dependants(0)
                .user(owner)
                .role(role)
                .build();
        businessUserRepository.save(businessUser);
        return business;
    }

    @Transactional
    public User addUserToBusiness(String invitorId, AddUserToBusinessRequest dto, String businessId) throws Exception {
        businessUserRepository.findByUserEmailAndBusinessId(dto.getEmail(), businessId).ifPresent((bu) -> {
            throw new ConflictException(BusinessMessages.ALREADY_INVITED);
        }); 
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new RuntimeException("Business not found"));
        Role role = roleRepository.findById(dto.getRoleId()).orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        User user;
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            user = userRepository.findByEmail(dto.getEmail()).get();
        } else {
            User createdUser = addUserToBusinessMapper.toUserEntity(dto);
            createdUser.setPassword(passwordEncoder.encode(createdUser.getPassword()));
            user = userRepository.save(createdUser);
        }
        BusinessUser businessUser = addUserToBusinessMapper.toBusinessUserEntity(dto, business, role);
        businessUser.setId(new BusinessUserId(businessId, user.getId()));
        // Set invitor if invitorId is provided and valid
        userRepository.findById(invitorId).ifPresent(invitor -> {
            businessUser.setInvitor(invitor);
        });

        businessUserRepository.save(businessUser);
        // send email to user with verify token
        ClassPathResource resource = new ClassPathResource("templates/verify-email.html");
        String html = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        html = html.replace("{{fullname}}", user.getFullname());
        html = html.replace("{{verifyToken}}", user.getVerifyToken());
        html = html.replace("http://yourdomain.com", "https://yourrealdomain.com");

        emailService.sendMail(businessId, user.getEmail(), "Verify your email", html);
        return user;
    }

    public Business updateBusiness(String businessId, UpdateBusinessRequest dto) {
        Business business = businessRepository.findById(businessId).orElseThrow(() -> new ResourceNotFoundException("No business found"));
        businessMapper.updateEntity(dto, business);
        dynamicMail.updateMailStrategy(business);
        return businessRepository.save(business);
    }
}