package server.rem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
// enable transaction 
@EnableTransactionManagement
@EnableAsync
// enable scheduling for cron job
@EnableScheduling
public class RemApplication {

    public static void main(String[] args) {
        SpringApplication.run(RemApplication.class, args);
    }

}
