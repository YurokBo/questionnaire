let id;

const loadPoll = () => {
    fetch ('https://netology-slow-rest.herokuapp.com/poll.php')
        .then(response => response.json())
        .then( response => {
            id = response.id;
            const {data} = response,
                pollTitle = document.getElementById('poll__title'),
                pollAnswers = document.getElementById('poll__answers');

            let out = '';

            pollTitle.textContent = data.title;

            const htmlData = data.answers.map((answer, index) => `<button class="poll__answer" data-answer="${index}">
                ${answer}
              </button>`);

            pollAnswers.innerHTML = htmlData.join('');
        } )
};

document.addEventListener('DOMContentLoaded', e => {
    loadPoll();
});

document.addEventListener('click', e => {
    if(!e.target.closest('.poll__answer')) {
        return;
    }

    const pollAnswer = e.target.closest('.poll__answer');

    fetch ('https://netology-slow-rest.herokuapp.com/poll.php', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: `vote=${id}&answer=${pollAnswer.dataset.answer}`
    })
        .then(r => r.json())
        .then(data => {
            const arr = data.stat;

            let sumVotes = 0;
            for(let i = 0, arrLength = arr.length; i < arrLength; i++) {
                sumVotes += arr[i].votes;
            }

            let pollAnswers = document.getElementById('poll__answers');

            pollAnswers.innerHTML = '';

            const htmlData = arr.map(({answer, votes}) => `
           <div>${answer} - ${(votes*100/sumVotes).toFixed(2)} %</div>
           `);

            pollAnswers.innerHTML =  htmlData.join('');


        });

    alert('Ваш ответ засчитан');
});


// POST-запрос
// с параметром *vote=id_опроса&answer=индекс_ответа_в_массиве_ответов* на адрес:
// *https://netology-slow-rest.herokuapp.com/poll.php* с заголовком
// *Content-type=application/x-www-form-urlencoded*