const inputs = document.querySelectorAll('input');
const bolitas = document.querySelectorAll('.bolitas');

inputs.forEach((input, index) => {
  input.addEventListener('focus', () => {
    input.classList.add('input-focus');
    bolitas[index].classList.add('rgb');
  });

  input.addEventListener('blur', () => {
    input.classList.remove('input-focus');
    bolitas[index].classList.remove('rgb');
  });
});