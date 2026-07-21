package mahametro.tripchart.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name = "tbl_issues")
public class Issues {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id ;
	@Column(name = "duty_no" , length = 5 , nullable = false)
	private Integer duty_no ;
	@Column(name = "description" , length = 100)
	private String description;
	@Column(name = "is_resolve")
	private boolean isResolve ; 
	
	
	
	public boolean isResolve() {
		return isResolve;
	}
	public void setResolve(boolean isResolve) {
		this.isResolve = isResolve;
	}
	public Integer getId() {
		return id;
	}
	public Integer getDuty_no() {
		return duty_no;
	}
	public String getDescription() {
		return description;
	}
	public void setDuty_no(Integer duty_no) {
		this.duty_no = duty_no;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	@Override
	public String toString() {
		return "Issues [id=" + id + ", duty_no=" + duty_no + ", description=" + description + ", isResolve=" + isResolve
				+ "]";
	}
	public Issues() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Issues(Integer duty_no, String description) {
		super();
		this.duty_no = duty_no;
		this.description = description;
	}
	
	
	
	

}
