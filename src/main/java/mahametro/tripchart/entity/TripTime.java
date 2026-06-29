package mahametro.tripchart.entity;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import mahametro.tripchart.enums.TripStartEnd;
@Entity
@Table(name ="tbl_trip_time")
public class TripTime {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;


    @Column(name = "train_id")
    private Integer trainId;
    @Column(name = "break_time")
    private LocalTime breakTime ;
    @Column(name = "trip_start_time")
    private LocalTime tripStartTime;
    @Column(name = "trip_end_time")
    private LocalTime tripEndTime ;
    @Column(name = "trip_starts_from" , length = 10)
    @Enumerated(EnumType.STRING)
    private TripStartEnd tripStartsFrom;
    @Column(name = "trip_ends_at" , length = 10)
    @Enumerated(EnumType.STRING)
    private TripStartEnd tripEndsAt;
    

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "duty_no")
    private TripDetails tripDetails;
	public TripTime() {
		super();
		// TODO Auto-generated constructor stub
	}
	public TripTime(Integer trainId, LocalTime breakTime, LocalTime tripStartTime, LocalTime tripEndTime,
			TripStartEnd tripStartsFrom, TripStartEnd tripEndsAt, TripDetails tripDetails) {
		super();
		this.trainId = trainId;
		this.breakTime = breakTime;
		this.tripStartTime = tripStartTime;
		this.tripEndTime = tripEndTime;
		this.tripStartsFrom = tripStartsFrom;
		this.tripEndsAt = tripEndsAt;
		this.tripDetails = tripDetails;
	}
	public Long getId() {
		return id;
	}
	public Integer getTrainId() {
		return trainId;
	}
	public LocalTime getBreakTime() {
		return breakTime;
	}
	public LocalTime getTripStartTime() {
		return tripStartTime;
	}
	public LocalTime getTripEndTime() {
		return tripEndTime;
	}
	public TripStartEnd getTripStartsFrom() {
		return tripStartsFrom;
	}
	public TripStartEnd getTripEndsAt() {
		return tripEndsAt;
	}
	public TripDetails getTripDetails() {
		return tripDetails;
	}
	public void setTrainId(Integer trainId) {
		this.trainId = trainId;
	}
	public void setBreakTime(LocalTime breakTime) {
		this.breakTime = breakTime;
	}
	public void setTripStartTime(LocalTime tripStartTime) {
		this.tripStartTime = tripStartTime;
	}
	public void setTripEndTime(LocalTime tripEndTime) {
		this.tripEndTime = tripEndTime;
	}
	public void setTripStartsFrom(TripStartEnd tripStartsFrom) {
		this.tripStartsFrom = tripStartsFrom;
	}
	public void setTripEndsAt(TripStartEnd tripEndsAt) {
		this.tripEndsAt = tripEndsAt;
	}
	public void setTripDetails(TripDetails tripDetails) {
		this.tripDetails = tripDetails;
	}
	@Override
	public String toString() {
		return "TripTime [id=" + id + ", trainId=" + trainId + ", breakTime=" + breakTime + ", tripStartTime="
				+ tripStartTime + ", tripEndTime=" + tripEndTime + ", tripStartsFrom=" + tripStartsFrom
				+ ", tripEndsAt=" + tripEndsAt + ", tripDetails=" + tripDetails + "]";
	}
	
	
	
	

}
