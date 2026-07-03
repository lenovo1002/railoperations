package mahametro.tripchart.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
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
import mahametro.tripchart.filter.JWTAuthFilter;
import java.util.List;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
//		DaoAuthenticationProvider authenticProvider= new DaoAuthenticationProvider();
//		authenticProvider.setUserDetailsService(userDetailsService());
//		authenticProvider.setPasswordEncoder(passwordEncoder());
//		return authenticProvider;
		
		    DaoAuthenticationProvider provider =
		            new DaoAuthenticationProvider(userDetailsService());

		    provider.setPasswordEncoder(passwordEncoder());

		    return provider;
		}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

	    CorsConfiguration configuration = new CorsConfiguration();

	    configuration.setAllowedOrigins(List.of("http://localhost:3000"));
	    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(List.of("*"));
	    configuration.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source =
	            new UrlBasedCorsConfigurationSource();

	    source.registerCorsConfiguration("/**", configuration);

	    return source;
	}
		
	
	
	@Bean
	public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception{
		return config.getAuthenticationManager();
	}
	
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
		
		    return http
		            .csrf(csrf -> csrf.disable())
		            .authorizeHttpRequests(auth -> auth
		                    .anyRequest().permitAll()
		            )
		            .build();
		
		
		
		
		
		
//		return http.csrf().disable()
//				.authorizeHttpRequests()
//				// Need to Permit for New Registration and Login
//				.requestMatchers("/users/new","/users/authenticate").permitAll().and()
//				.authorizeHttpRequests().requestMatchers("/products/**")
//				.authenticated().and()
//				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//				.and().authenticationProvider(authProvider())
//				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//				.build();
		
		

//		    return http
//		    		.cors(Customizer.withDefaults())
//		            .csrf(csrf -> csrf.disable())
//		            
//
//		            .authorizeHttpRequests(auth -> auth
//		            	    .requestMatchers(
//		            	            "/",
//		            	            "/index.html",
//		            	            "/favicon.ico",
//		            	            "/manifest.json",
//		            	            "/asset-manifest.json",
//		            	            "/robots.txt",
//		            	            "/logo192.png",
//		            	            "/logo512.png",
//		            	            "/static/**"
//		            	    ).permitAll()
//
//		            	    .requestMatchers(
//		            	            "/admin/new",
//		            	            "/admin/authenticate",
//		            	            "/admin/welcome",
//		            	            "/tripchart/test"
//		            	    ).permitAll()
//
//		            	    .requestMatchers("/tripchart/**").authenticated()
//
//		            	    .anyRequest().authenticated()
//		            	)
//
//		            .sessionManagement(session ->
//		                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//		            )
//
//		            .authenticationProvider(authProvider())
//		            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//
//		            .build();
				
	}
}
