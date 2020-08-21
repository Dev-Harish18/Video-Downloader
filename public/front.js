const input = document.getElementById('link')
const messageBox = document.getElementById('error')
input.value = input.value.trim()
const type = document.getElementById('type')
const details = document.getElementById('details')
const video = document.getElementById('video')
const desc = document.getElementById('desc')
const downloadBtn = document.getElementById("downloadBtn")
const hiddenForm = document.getElementById('hiddenForm')
const btnContainer = document.getElementById('btnContainer')



const tl = gsap.timeline()
tl.from('#logo-container', {
    duration: 0.8,
    scale: 2,
    ease: 'back'
}).from('.form-container', {
    duration: 0.8,
    scaleX: 0,
    ease: 'elastic'
}).from('#downloadBtn', {
    duration: 0.5,
    scaleY: 0,
    ease: 'back'
}, "-=0.3").from('.footer', {
    duration: 0.8,
    x: 200,
    ease: 'elastic'
}, '-=0.3')



downloadBtn.addEventListener('click', async function (e) {
    e.preventDefault()
    $('#error').empty()

    if (messageBox.classList.contains('alert-danger'))
        messageBox.classList.remove('alert-danger')
    else
        messageBox.classList.remove('alert-success')


    if (input.value == '')
        flash('danger', 'Please paste your link')
    else if (input.value.split('/')[2].charAt(4) == 'i') {
        document.getElementById('gif').src = "img/gif.gif"
        document.getElementById('gif').style.opacity = 1
        res = await axios({
            method: 'post',
            url: '/download/instagram',
            data: {
                url: input.value
            }
        })
        //console.log(res.data)

        if (!res.data.error) {
            gsap.set('.form', {
                transformStyle: 'preserve-3d'
            })

            gsap.set('.form-container', {
                perspective: 800
            })

            gsap.to('.form', {
                duration: 1,
                ease: 'back',
                rotationY: 180
            })

            $('#form-elements').html(res.data)
            gsap.to('#form-elements', {
                duration: 0.2,
                rotationY: 180
            })
        } else {
            document.getElementById('gif').src = ""
            flash('danger', 'Invalid Instagram video link')
        }

    } else if (input.value.split('/')[2].charAt(0) == 'y') {
        document.getElementById('gif').src = "img/gif.gif"
        document.getElementById('gif').style.opacity = 1
        window.localStorage.setItem('link', input.value)
        const res = await axios({
            url: '/download/youtube',
            method: 'post',
            data: {
                link: input.value
            }
        })
        // console.log(res.data)
        if (res.data.error) {
            document.getElementById('gif').src = ""
            flash('danger', res.data.error)
        } else {
            gsap.set('.form', {
                transformStyle: 'preserve-3d'
            })

            gsap.set('.form-container', {
                perspective: 800
            })

            gsap.to('.form', {
                duration: 1,
                ease: 'back',
                rotationY: 180
            })



            $('#form-elements').html(res.data)
            gsap.timeline().to('#form-elements', {
                duration: 0.2,
                rotationY: 180
            }).from('#btnContainer', {
                duration: 0.5,
                x: -200,
                ease: 'power4'
            }).from('#youtube-details', {
                duration: 0.5,
                x: 20,
                ease: 'power4'
            }, '-=0.4')
        }

    } else {
        document.getElementById('gif').src = ""
        flash('danger', 'Invalid Link')
    }


})

$('#link').on('focus', function (e) {
    $('#input-container').addClass('--open')
    $('#input-container').addClass('--focus')
    $('#input-container').addClass('input-focus')
    gsap.from('.input-focus', {
        duration: 0.9,
        scale: 1.5,
        skewX: 360,
        ease: 'back'
    })

})
$('#link').on('blur', function () {
    $('#input-container').removeClass('--focus')
    $('#input-container').removeClass('--open')
    $('#input-container').removeClass('input-focus')
})



$('body').on('click', function (e) {

    console.log({
        e
    })
    if (e.target.classList.contains('btnQuality')) {
        e.preventDefault()

        const btn = e.target
        const itag = btn.getAttribute('data-itag')
        const link = window.localStorage.getItem('link')
        window.location.href = `/download?link=${link}&itag=${itag}`
    }
})



function flash(mode, message) {
    const removeClass = (mode == 'success') ? 'danger' : 'success'
    if (messageBox.classList.contains(`alert-${removeClass}`))
        messageBox.classList.remove(`alert-${removeClass}`)
    messageBox.classList.add(`alert-${mode}`)
    messageBox.innerHTML = message
    gsap.from(messageBox, {
        duration: 1,
        y: -500,
        ease: 'elastic'
    })
}