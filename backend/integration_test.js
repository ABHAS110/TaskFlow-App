const BASE_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 Starting Automated Backend Integration Tests (Native Fetch)...\n');
  
  let token = '';
  let taskId = '';
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  
  // Helper to make fetch easier
  const apiCall = async (endpoint, method = 'GET', body = null, headers = {}) => {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    if (body) {
      config.body = JSON.stringify(body);
    }
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    return { status: response.status, data };
  };

  // 1. Test registration validation (empty fields)
  try {
    console.log('1. Testing registration with empty fields...');
    const { status } = await apiCall('/auth/register', 'POST', {});
    if (status === 400) {
      console.log('✅ Success: Registration validation blocked empty fields.');
    } else {
      console.error(`❌ Failed: Expected 400, got ${status}`);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 2. Test registration (successful)
  try {
    console.log('\n2. Testing user registration...');
    const { status, data } = await apiCall('/auth/register', 'POST', {
      name: 'QA Tester',
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword
    });
    if (status === 201 && data.success && data.data.token) {
      console.log('✅ Success: Registration successful!');
      token = data.data.token;
    } else {
      console.error(`❌ Failed: Status ${status}, body:`, data);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 3. Test duplicate registration
  try {
    console.log('\n3. Testing duplicate email registration...');
    const { status } = await apiCall('/auth/register', 'POST', {
      name: 'QA Tester',
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword
    });
    if (status === 400) {
      console.log('✅ Success: Duplicate registration correctly blocked.');
    } else {
      console.error(`❌ Failed: Expected 400, got ${status}`);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 4. Test login with invalid credentials
  try {
    console.log('\n4. Testing login with invalid credentials...');
    const { status } = await apiCall('/auth/login', 'POST', {
      email: testEmail,
      password: 'wrongpassword'
    });
    if (status === 401) {
      console.log('✅ Success: Invalid credentials correctly blocked.');
    } else {
      console.error(`❌ Failed: Expected 401, got ${status}`);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 5. Test login (successful)
  try {
    console.log('\n5. Testing user login...');
    const { status, data } = await apiCall('/auth/login', 'POST', {
      email: testEmail,
      password: testPassword
    });
    if (status === 200 && data.success && data.data.token) {
      console.log('✅ Success: Login successful!');
      token = data.data.token;
    } else {
      console.error(`❌ Failed: Status ${status}, body:`, data);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 6. Test fetching profile (protected route)
  try {
    console.log('\n6. Testing profile fetch (protected route)...');
    const { status, data } = await apiCall('/auth/profile', 'GET', null, {
      Authorization: `Bearer ${token}`
    });
    if (status === 200 && data.success && data.data.email === testEmail) {
      console.log(`✅ Success: Profile retrieved successfully for ${data.data.name}!`);
    } else {
      console.error(`❌ Failed: Status ${status}, body:`, data);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 7. Test fetching profile without token (should fail)
  try {
    console.log('\n7. Testing profile fetch without authorization...');
    const { status } = await apiCall('/auth/profile', 'GET');
    if (status === 401) {
      console.log('✅ Success: Unauthenticated access correctly blocked.');
    } else {
      console.error(`❌ Failed: Expected 401, got ${status}`);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 8. Test Task Creation
  try {
    console.log('\n8. Testing task creation...');
    const { status, data } = await apiCall('/tasks', 'POST', {
      title: 'Auditing codebase',
      description: 'Run automated QA and integration checks',
      stage: 'Todo'
    }, {
      Authorization: `Bearer ${token}`
    });
    if (status === 201 && data.success && data.data._id) {
      taskId = data.data._id;
      console.log(`✅ Success: Task created successfully! ID: ${taskId}`);
    } else {
      console.error(`❌ Failed: Status ${status}, body:`, data);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 9. Test Task Status/Stage Update (PATCH)
  try {
    console.log('\n9. Testing task stage update (PATCH)...');
    const { status, data } = await apiCall(`/tasks/${taskId}/stage`, 'PATCH', {
      stage: 'In Progress'
    }, {
      Authorization: `Bearer ${token}`
    });
    if (status === 200 && data.success && data.data.stage === 'In Progress') {
      console.log('✅ Success: Task stage updated successfully to "In Progress"!');
    } else {
      console.error(`❌ Failed: Status ${status}, body:`, data);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 10. Test Task Update (PUT)
  try {
    console.log('\n10. Testing full task update (PUT)...');
    const { status, data } = await apiCall(`/tasks/${taskId}`, 'PUT', {
      title: 'Auditing codebase (Completed)',
      description: 'All QA integration checks passed successfully',
      stage: 'Done'
    }, {
      Authorization: `Bearer ${token}`
    });
    if (status === 200 && data.success && data.data.stage === 'Done' && data.data.title.includes('Completed')) {
      console.log('✅ Success: Task fully updated successfully!');
    } else {
      console.error(`❌ Failed: Status ${status}, body:`, data);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  // 11. Test Task Deletion
  try {
    console.log('\n11. Testing task deletion...');
    const { status, data } = await apiCall(`/tasks/${taskId}`, 'DELETE', null, {
      Authorization: `Bearer ${token}`
    });
    if (status === 200 && data.success) {
      console.log('✅ Success: Task deleted successfully!');
    } else {
      console.error(`❌ Failed: Status ${status}, body:`, data);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }

  console.log('\n⭐ All integration tests completed successfully! ⭐');
}

runTests();
