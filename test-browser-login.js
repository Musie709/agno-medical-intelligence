// Test script to run in browser console
// Copy and paste this into your browser's developer console

console.log('🧪 Testing Supabase login in browser...');

// Test the login
async function testLogin() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'elsa@agno.org',
      password: 'Elsa1234@'
    });
    
    if (error) {
      console.error('❌ Login error:', error);
      return false;
    } else {
      console.log('✅ Login successful!');
      console.log('User:', data.user.email);
      console.log('Session:', data.session ? 'Available' : 'None');
      return true;
    }
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}

// Run the test
testLogin().then(success => {
  if (success) {
    console.log('🎉 Login test passed! You can now use elsa@agno.org');
  } else {
    console.log('❌ Login test failed. Check the error above.');
  }
}); 