const endpoint=`http://localhost:3000`
const registerForm = document.querySelector('#registerForm')
registerForm.addEventListener('submit',async (eve) => {
    eve.preventDefault();
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const age = document.getElementById("age").value
    const gender = document.getElementById("gender").value
    const profession = document.getElementById("profession").value
    const budget = document.getElementById("budget").value
    const phone=document.getElementById("phone").value
    try{
       const response=await axios.post(`${endpoint}/signup`,{name,email,password,age,gender,profession,budget,phone})
       alert('Signup Successfull');
       window.location.href='../login.html';
    }catch(err){
        console.log('Error in register frontend',err);
    }
})