//package rs.devlabs.slozna.zgrada.security;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import rs.devlabs.slozna.zgrada.data.Role;
//
//
//@Configuration
//@EnableWebSecurity
//public class BasicAuthSecurityConfig extends WebSecurityConfigurerAdapter {
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder(10);
//    }
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http.cors()
//                .and()
//                .csrf().disable()
//                .formLogin().disable()
//                .logout().disable()
//                .authorizeRequests().antMatchers("/login/**").permitAll()
//                .and()
//                .authorizeRequests().antMatchers("/user/**").hasAnyRole(Role.UPRAVNIK.name(), Role.STANAR.name())
//                .and()
//                .authorizeRequests().antMatchers("/notification/**").hasAnyRole(Role.UPRAVNIK.name(), Role.STANAR.name())
//                .and()
//                .authorizeRequests().antMatchers("/poll/**").hasAnyRole(Role.UPRAVNIK.name(), Role.STANAR.name())
//                .and()
//                .authorizeRequests().antMatchers("/debt/**").hasAnyRole(Role.UPRAVNIK.name(), Role.STANAR.name())
//                .and()
//                .authorizeRequests().anyRequest().permitAll()
//                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and().httpBasic();
//    }
//
////    @Bean
////    public CorsConfigurationSource corsConfigurationSource() {
////        CorsConfiguration configuration = new CorsConfiguration();
////        configuration.setAllowedOrigins(Arrays.asList("*"));
////        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH"));
////        configuration.setAllowCredentials(true);
////        //the below three lines will add the relevant CORS response headers
////        configuration.addAllowedOrigin("*");
////        configuration.addAllowedHeader("*");
////        configuration.addAllowedMethod("*");
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        source.registerCorsConfiguration("/**", configuration);
////        return source;
////    }
//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth
//                .eraseCredentials(true)
//                .userDetailsService(userDetailsService)
//                .passwordEncoder(passwordEncoder());
//    }
//}
