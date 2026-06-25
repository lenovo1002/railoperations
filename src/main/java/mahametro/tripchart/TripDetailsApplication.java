package mahametro.tripchart;

import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import mahametro.tripchart.entity.TripDetails;
import mahametro.tripchart.enums.SignOnLocation;
import mahametro.tripchart.repository.TripRepo;


@SpringBootApplication
public class TripDetailsApplication   {

	@Autowired
	private TripRepo tripService;

	public static void main(String[] args) {
		SpringApplication.run(TripDetailsApplication.class, args);
	}

	

}
