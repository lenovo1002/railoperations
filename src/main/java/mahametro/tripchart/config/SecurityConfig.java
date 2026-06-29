package mahametro.tripchart.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import mahametro.tripchart.filter.JWTAuthFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	
	@Autowired
	private JWTAuthFilter jwtAuthFilter;
	
	@Bean
	public UserDetailsService userDetailsService() {
		return new UserInfoUserDetailsService();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authProvider() {
		DaoAuthenticationProvider authenticProvider= new DaoAuthenticationProvider();
		authenticProvider.setUserDetailsService(userDetailsService());
		authenticProvider.setPasswordEncoder(passwordEncoder());
		return authenticProvider;
		
	}
	
	@Bean
	public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception{
		return config.getAuthenticationManager();
	}
	
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
		
		return http.csrf().disable()
				.authorizeHttpRequests()
				// Need to Permit for New Registration and Login
				.requestMatchers("/users/new","/users/authenticate").permitAll().and()
				.authorizeHttpRequests().requestMatchers("/products/**")
				.authenticated().and()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and().authenticationProvider(authProvider())
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
				
	}
}
