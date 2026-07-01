package mahametro.tripchart.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import mahametro.tripchart.enums.Role;

@Entity
@Table(name="jwt_userinfo")
public class UserInfo {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
    private String name;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "user_role" ,length = 7)
    private Role roles;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Role getRoles() {
		return roles;
	}
	
	public UserInfo(String name, String email, String password) {
		super();
		this.name = name;
		this.email = email;
		this.password = password;
		this.roles = Role.ADMIN ;
	}
    
	public UserInfo() {}
	@Override
	public String toString() {
		return "UserInfo [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", roles="
				+ roles + "]";
	}
	
	
 
}
