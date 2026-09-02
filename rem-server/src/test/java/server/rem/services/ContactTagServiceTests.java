package server.rem.services;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import server.rem.entities.ContactTag;
import server.rem.mappers.ContactTagMapper;
import server.rem.repositories.BusinessRepository;
import server.rem.repositories.ContactTagRepository;

@ExtendWith(MockitoExtension.class)
class ContactTagServiceTests {
    @Mock
    private ContactTagRepository contactTagRepository;
    @Mock
    private ContactTagMapper contactTagMapper;
    @Mock
    private BusinessRepository businessRepository;

    private ContactTagService contactTagService;

    @BeforeEach
    void setUp() {
        contactTagService = new ContactTagService(contactTagRepository, contactTagMapper, businessRepository);
    }

    @Test
    void togglesActiveTag() {
        ContactTag tag = ContactTag.builder().isActive(true).build();
        when(contactTagRepository.findById("tag-id")).thenReturn(Optional.of(tag));
        when(contactTagRepository.save(tag)).thenReturn(tag);

        assertSame(tag, contactTagService.toggleActive("tag-id"));
        assertFalse(tag.getIsActive());
    }
}
