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

package be.ordina.msdashboard.catalog;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import be.ordina.msdashboard.applicationinstance.ApplicationInstance;

import static java.util.stream.Collectors.toList;

/**
 * Catalog that keeps track of all known applications and their instances in the environment.
 *
 * @author Tim Ysewyn
 * @author Steve De Zitter
 */
public class Catalog {

	private Set<String> applications = new HashSet<>();
	private Map<String, List<String>> applicationInstances = new HashMap<>();

	public List<String> getApplications() {
		return new ArrayList<>(this.applications);
	}

	void addApplication(String application) {
		this.applications.add(application);
	}

	void removeApplication(String application) {
		this.applications.remove(application);
	}

	void addApplicationInstance(ApplicationInstance applicationInstance) {
		this.addApplication(applicationInstance.getApplication());
		List<String> instances = this.applicationInstances.getOrDefault(applicationInstance.getApplication(), new ArrayList<>());
		instances.add(applicationInstance.getId());
		this.applicationInstances.put(applicationInstance.getApplication(), instances);
	}

	void removeApplicationInstance(ApplicationInstance applicationInstance) {
		List<String> instances = this.applicationInstances.getOrDefault(applicationInstance.getApplication(), new ArrayList<>());
		instances.remove(applicationInstance.getId());
		this.applicationInstances.put(applicationInstance.getApplication(), instances);
	}

	List<String> getApplicationInstances() {
		return this.applicationInstances.values().stream()
				.flatMap(List::stream)
				.collect(toList());
	}

	public List<String> getApplicationInstancesForApplication(String application) {
		return this.applicationInstances.getOrDefault(application, new ArrayList<>());
	}
}
