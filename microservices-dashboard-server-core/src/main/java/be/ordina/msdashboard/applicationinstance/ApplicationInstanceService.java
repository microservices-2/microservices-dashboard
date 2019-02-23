/*
 * Copyright 2015-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package be.ordina.msdashboard.applicationinstance;

import java.util.List;
import java.util.Optional;

import org.springframework.boot.actuate.health.Status;
import org.springframework.cloud.client.ServiceInstance;

/**
 * Application service to interact with an {@link ApplicationInstance application instance}.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public class ApplicationInstanceService {

	private final ApplicationInstanceRepository repository;

	private final ActuatorEndpointsDiscovererService actuatorEndpointsDiscovererService;

	public ApplicationInstanceService(ApplicationInstanceRepository repository,
			ActuatorEndpointsDiscovererService actuatorEndpointsDiscovererService) {
		this.repository = repository;
		this.actuatorEndpointsDiscovererService = actuatorEndpointsDiscovererService;
	}

	public Optional<String> getApplicationInstanceIdForServiceInstance(ServiceInstance serviceInstance) {
		return Optional.ofNullable(this.repository.getById(serviceInstance.getInstanceId()))
				.map(ApplicationInstance::getId);
	}

	public String createApplicationInstanceForServiceInstance(final ServiceInstance serviceInstance) {
		this.actuatorEndpointsDiscovererService.findActuatorEndpoints(serviceInstance)
				.subscribe(actuatorEndpoints -> {
					ApplicationInstance applicationInstance = ApplicationInstance.Builder
							.forApplicationWithId(serviceInstance.getServiceId(), serviceInstance.getInstanceId())
							.baseUri(serviceInstance.getUri())
							.actuatorEndpoints(actuatorEndpoints)
							.build();
					this.repository.save(applicationInstance);
				});
		return serviceInstance.getInstanceId();
	}

	public void deleteApplicationInstance(String applicationInstanceId) {
		Optional.ofNullable(this.repository.getById(applicationInstanceId))
				.ifPresent(applicationInstance -> {
					applicationInstance.delete();
					this.repository.save(applicationInstance);
				});
	}

	public List<ApplicationInstance> getApplicationInstances() {
		return this.repository.getAll();
	}

	public void updateHealthStatusForApplicationInstance(String applicationInstanceId, Status healthStatus) {
		ApplicationInstance instance = this.repository.getById(applicationInstanceId);
		instance.updateHealthStatus(healthStatus);
		this.repository.save(instance);
	}

}
