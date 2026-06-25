package mahametro.tripchart.entity;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
@Entity
@Table(name ="tbl_trip_time")
public class TripTime {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    @Column(name = "train_id")
    private Integer trainId;

    @Column(name = "trip_time")
    private LocalTime tripTime;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "duty_no")
    private TripDetails tripDetails;
	public TripTime() {
		super();
		// TODO Auto-generated constructor stub
	}
	public TripTime(Integer trainId, LocalTime tripTime) {
		super();
		this.trainId = trainId;
		this.tripTime = tripTime;
	}
	public Integer getTrainId() {
		return trainId;
	}
	public LocalTime getTripTime() {
		return tripTime;
	}
	public void setTrainId(Integer trainId) {
		this.trainId = trainId;
	}
	public void setTripTime(LocalTime tripTime) {
		this.tripTime = tripTime;
	}
	
	
	
	
	
	public TripDetails getTripDetails() {
		return tripDetails;
	}
	public void setTripDetails(TripDetails tripDetails) {
		this.tripDetails = tripDetails;
	}
	@Override
	public String toString() {
		return "TripTime [trainId=" + trainId + ", tripTime=" + tripTime + "]";
	}
	
	

}
