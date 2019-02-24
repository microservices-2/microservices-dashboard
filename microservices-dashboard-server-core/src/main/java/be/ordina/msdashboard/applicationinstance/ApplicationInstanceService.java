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

import be.ordina.msdashboard.applicationinstance.commands.CreateApplicationInstance;
import be.ordina.msdashboard.applicationinstance.commands.DeleteApplicationInstance;
import be.ordina.msdashboard.applicationinstance.commands.UpdateActuatorEndpoints;
import be.ordina.msdashboard.applicationinstance.commands.UpdateApplicationInstanceHealth;

import org.springframework.cloud.client.ServiceInstance;

/**
 * Application service to interact with an {@link ApplicationInstance application instance}.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public class ApplicationInstanceService {

	private final ApplicationInstanceRepository repository;

	public ApplicationInstanceService(ApplicationInstanceRepository repository) {
		this.repository = repository;
	}

	public Optional<String> getApplicationInstanceIdForServiceInstance(ServiceInstance serviceInstance) {
		return this.getById(serviceInstance.getInstanceId())
				.map(ApplicationInstance::getId);
	}

	public Optional<ApplicationInstance> getById(String id) {
		return Optional.ofNullable(this.repository.getById(id));
	}

	public List<ApplicationInstance> getApplicationInstances() {
		return this.repository.getAll();
	}

	public String createApplicationInstance(CreateApplicationInstance command) {
		final ServiceInstance serviceInstance = command.getServiceInstance();
		ApplicationInstance applicationInstance = ApplicationInstance.Builder
				.forApplicationWithId(serviceInstance.getServiceId(), serviceInstance.getInstanceId())
				.baseUri(serviceInstance.getUri())
				.build();
		return this.repository.save(applicationInstance).getId();
	}

	public void updateApplicationInstanceHealth(final UpdateApplicationInstanceHealth command) {
		this.getById(command.getId())
				.ifPresent(applicationInstance -> {
					applicationInstance.updateHealthStatus(command.getHealthStatus());
					this.repository.save(applicationInstance);
				});
	}

	public void updateActuatorEndpoints(final UpdateActuatorEndpoints command) {
		this.getById(command.getId())
				.ifPresent(applicationInstance -> {
					applicationInstance.updateActuatorEndpoints(command.getActuatorEndpoints());
					this.repository.save(applicationInstance);
				});
	}

	public void deleteApplicationInstance(final DeleteApplicationInstance command) {
		this.getById(command.getId())
				.ifPresent(applicationInstance -> {
					applicationInstance.delete();
					this.repository.save(applicationInstance);
				});
	}

}
