// Test script to check backend connectivity
async function testBackend() {
  try {
    console.log('Testing backend connectivity...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8000/health');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health check response:', healthData);
    }
    
    // Test registration endpoint
    const testData = {
      full_name: "Test Vendor",
      phone: "+91 9999999999",
      password: "testpass123"
    };
    
    console.log('Testing registration with data:', testData);
    
    const regResponse = await fetch('http://localhost:8000/vendor/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Registration status:', regResponse.status);
    const regData = await regResponse.json();
    console.log('Registration response:', regData);
    
  } catch (error) {
    console.error('Backend test failed:', error.message);
    console.log('Make sure the backend server is running on http://localhost:8000');
  }
}

testBackend(); 