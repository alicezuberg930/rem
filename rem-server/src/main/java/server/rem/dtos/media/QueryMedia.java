package server.rem.dtos.media;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import server.rem.dtos.QueryPaginate;
import server.rem.enums.MediaStatus;

@Getter
@Setter
@NoArgsConstructor
public class QueryMedia extends QueryPaginate {
    private MediaStatus media;

    public QueryMedia(Integer pageSize, Integer page, MediaStatus media) {
        super(pageSize, page);
        this.media = media;
    }
}
