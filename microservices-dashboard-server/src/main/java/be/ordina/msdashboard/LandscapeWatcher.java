package be.ordina.msdashboard;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import be.ordina.msdashboard.events.NewServiceDiscovered;
import be.ordina.msdashboard.events.NewServiceInstanceDiscovered;
import be.ordina.msdashboard.events.ServiceDeregistered;
import be.ordina.msdashboard.events.ServiceInstanceDeregistered;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.discovery.event.HeartbeatEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;

import static org.apache.commons.collections4.CollectionUtils.intersection;
import static org.apache.commons.collections4.CollectionUtils.subtract;

/**
 * Watcher that will dispatch events whenever there is a change in the landscape.
 *
 * @author Tim Ysewyn
 */
public class LandscapeWatcher {

	private static final Logger logger = LoggerFactory.getLogger(LandscapeWatcher.class);

	private final DiscoveryClient discoveryClient;
	private final ApplicationEventPublisher publisher;
	private final Map<String, List<ServiceInstance>> serviceInstances = new HashMap<>();

	private List<String> services = new ArrayList<>();

	public LandscapeWatcher(DiscoveryClient discoveryClient, ApplicationEventPublisher publisher) {
		this.discoveryClient = discoveryClient;
		this.publisher = publisher;
	}

	@EventListener({ApplicationStartedEvent.class})
	public void discoverLandscape() {
		logger.debug("Discovering landscape");
		this.services = this.discoveryClient.getServices();
		processNewServices(this.services);
	}

	@EventListener({HeartbeatEvent.class})
	public void checkForChangesInLandscape() {
		logger.debug("Checking for changes in landscape");
		List<String> retrievedServices = this.discoveryClient.getServices();
		processNewServices(subtract(retrievedServices, this.services));
		processDeletedServices(subtract(this.services, retrievedServices));
		processExistingServices(intersection(this.services, retrievedServices));
		this.services = retrievedServices;
	}

	private void processNewServices(Collection<String> newServices) {
		logger.debug("Discovering new services");
		newServices.forEach(service -> {
			logger.debug("Registering new service '{}'", service);
			List<ServiceInstance> instances = this.discoveryClient.getInstances(service);
			processNewServiceInstances(instances);
			this.serviceInstances.put(service, instances);
			this.publisher.publishEvent(new NewServiceDiscovered(service));
		});
	}

	private void processDeletedServices(Collection<String> deletedServices) {
		logger.debug("Checking deregistered services");
		deletedServices.forEach(service -> {
			logger.debug("Deregistering service '{}'", service);
			List<ServiceInstance> serviceInstances = this.serviceInstances.remove(service);
			processDeletedServiceInstances(serviceInstances);
			this.publisher.publishEvent(new ServiceDeregistered(service));
		});
	}

	private void processExistingServices(Collection<String> existingServices) {
		logger.debug("Checking for changes in known services");
		existingServices.forEach(service -> {
			List<ServiceInstance> retrievedInstances = this.discoveryClient.getInstances(service);
			List<ServiceInstance> knownServiceInstances = this.serviceInstances.getOrDefault(service, Collections.emptyList());
			processNewServiceInstances(subtract(retrievedInstances, knownServiceInstances));
			processDeletedServiceInstances(subtract(knownServiceInstances, retrievedInstances));
			this.serviceInstances.put(service, retrievedInstances);
		});
	}

	private void processNewServiceInstances(Collection<ServiceInstance> newServiceInstances) {
		newServiceInstances.forEach(serviceInstance -> {
			logger.debug("Registering new service instance for '{}'", serviceInstance.getServiceId());
			this.publisher.publishEvent(new NewServiceInstanceDiscovered(serviceInstance));
		});
	}

	private void processDeletedServiceInstances(Collection<ServiceInstance> deletedServiceInstances) {
		deletedServiceInstances.forEach(serviceInstance -> {
			logger.debug("Deregistering service instance for '{}'", serviceInstance.getServiceId());
			this.publisher.publishEvent(new ServiceInstanceDeregistered(serviceInstance));
		});
	}

}