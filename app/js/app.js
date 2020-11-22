// JavaScript Document

import $ from "jquery";
import debounce from 'lodash.debounce';
import {rwdMedia} from "./rwdMedia";
import {rippletInit} from './ripplet';
import './nav-scroll';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/alert';
import 'bootstrap/js/dist/tab';
import Cookies from 'js-cookie';
import bsCustomFileInput from 'bs-custom-file-input';
import datepicker from 'bootstrap-datepicker';
import {addBackToTop} from 'vanilla-back-to-top';


window.debounce = debounce;
window.rwdMedia = rwdMedia;
window.Cookies = Cookies;
window.rippletInit = rippletInit;
window.bsCustomFileInput = bsCustomFileInput;
window.addBackToTop = addBackToTop;
window.datepicker = datepicker;


document.addEventListener('DOMContentLoaded', function(){

    bsCustomFileInput.init();

    window.onscroll = () => { handleHeader() };
    handleHeader();

    rippletInit();

    addBackToTop({
        diameter: 56,
        backgroundColor: '#FFFFFF',
        textColor: '#F28300',
        innerHTML: ''
    });

    $('.nav-scroll').navScroll();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $('.tab-pane.active .nav-scroll').navScroll();
    })

    $('[data-toggle="popover"]').popover({
        content: function () {
            return $(this.dataset['contentid']).contents().clone()
        }
    });



    // START ------------- add new truck -------------

    const addTruckBtn = () => {

        const addTruckBtnSet = document.querySelectorAll('[data-add-truck]');
        addTruckBtnSet.forEach( btn => {

            btn.addEventListener("click", e => {

                btn.disabled = true;

                const truckId = btn.dataset.addTruck;
                const newTruck = document.querySelector(`[data-new-truck="${truckId}"]`);
                const cloneTruck = newTruck.cloneNode(true);

                cloneTruck.classList.add('d-flex');
                cloneTruck.classList.remove('d-none');
                cloneTruck.setAttribute('id', `truck-${truckId}`);
                delete cloneTruck.dataset.newTruck;

                newTruck.before(cloneTruck);

                cloneTruck.querySelector('[id^="truck-capacity-"]').setAttribute('id', `truck-capacity-${truckId}`);
                cloneTruck.querySelector('[for^="truck-capacity-"]').setAttribute('for', `truck-capacity-${truckId}`);
                cloneTruck.querySelector('[data-remove-truck]').setAttribute('data-remove-truck', `${truckId}`);

                const offer = ['standard', 'express', 'fix'];

                offer.forEach(item => {
                    cloneTruck.querySelector(`[id^="${item}-"]`).setAttribute('id', `${item}-${truckId}`);
                    cloneTruck.querySelector(`[aria-describedby^="${item}-"]`).setAttribute('aria-describedby', `${item}-${truckId}`);
                });

                removeTruckBtn();

                // fetch który zwróci nową wartość dla atrybutu data-add-truck i data-new-truck
                // setTimeout( () => btn.disabled = false, 1000 );

            });

        })

    };

    addTruckBtn();



    // START ------------- remove new truck -------------

    const removeTruckBtn = () => {

        const removeTruckBtnSet = document.querySelectorAll('[data-remove-truck]');
        removeTruckBtnSet.forEach( btn => {

            btn.addEventListener("click", e => {

                const truckId = btn.dataset.removeTruck;
                const currentTruck = document.querySelector(`[id="truck-${truckId}"]`);
                currentTruck.remove();

            });

        })
    };

    removeTruckBtn();





    // START ------------- datepicker init -------------

    $('.js-date-form-control').datepicker({
        maxViewMode: 0,
        language: "pl",
        orientation: "bottom auto",
        daysOfWeekDisabled: "6,7",
        autoclose: true,
        todayHighlight: true
    });




    // START ------------- order done checkbox -------------

    const doneCheckboxSet = document.querySelectorAll('[name^="done-"]');

    doneCheckboxSet.forEach(item => {

        item.addEventListener("change", e => {
            const tr = e.target.closest('tr');
            const accept = tr.querySelector('[name^="accept-"]');

            if (item.checked) {
                accept.disabled = true;
            } else {
                accept.disabled = false;
            }

            /*
            // row hiding animation
            const tr = e.target.closest('tr');
            const tdSet = tr.querySelectorAll('td');
            tdSet.forEach(item => {
                const inner = item.innerHTML;
                const wrapper = document.createElement('div');
                wrapper.classList.add('wrapper');
                wrapper.innerHTML = inner;
                item.innerHTML = '';
                item.appendChild(wrapper);
            })
            setTimeout(() => tr.classList.add('done'), 10);
            */
        });
    })




    // START ------------- order accept checkbox -------------

    const acceptCheckboxSet = document.querySelectorAll('[name^="accept-"]');

    acceptCheckboxSet.forEach(item => {

        item.addEventListener("change", e => {
            const tr = e.target.closest('tr');
            const done = tr.querySelector('[name^="done-"]');

            if (item.checked) {
                tr.removeAttribute('data-pending');
                if ( tr.dataset.upcoming === undefined ) done.disabled = false;
            } else {
                tr.setAttribute('data-pending', '');
                if ( tr.dataset.upcoming === undefined ) done.disabled = true;
            }
        });

    })




    // START ------------- order modal -------------

    const partnerOrdersModal = document.querySelector('#partnerOrdersModal');

    $(partnerOrdersModal).on('show.bs.modal', function (e) {

        const tr = e.relatedTarget.closest('tr');
        const area = tr.closest('table').dataset.area;
        const trId = tr.id;
        const trOffer = tr.querySelector('[data-offer]');
        const trAddress = tr.querySelector('[data-address]');
        const trContact = tr.querySelector('[data-contact]');
        const trTimeLimit = tr.querySelector('[data-time-limit]');
        const trInfo = tr.querySelector('[data-info]');

        const ordersModalTitle = partnerOrdersModal.querySelector('[data-title-id]');
        const ordersModalId = partnerOrdersModal.querySelector('[data-order]');
        const ordersModalOffer = partnerOrdersModal.querySelector('[data-offer]');
        const ordersModalAddress = partnerOrdersModal.querySelector('[data-address]');
        const ordersModalContact = partnerOrdersModal.querySelector('[data-contact]');
        const ordersModalTimeLimit = partnerOrdersModal.querySelector('[data-time-limit]');
        const ordersModalInfo = partnerOrdersModal.querySelector('[data-info]');

        ordersModalTitle.innerHTML = trId;
        ordersModalId.id = trId;

        if ( ('info' in e.relatedTarget.dataset) ) {

            ordersModalOffer.closest('tr').style.display = 'none';
            ordersModalAddress.closest('tr').style.display = 'none';
            ordersModalTimeLimit.closest('tr').style.display = 'none';

        } else {

            ordersModalOffer.closest('tr').style.display = '';
            ordersModalAddress.closest('tr').style.display = '';
            ordersModalTimeLimit.closest('tr').style.display = '';

            ordersModalOffer.innerHTML = trOffer.innerHTML;
            ordersModalAddress.innerHTML = area;
            ordersModalAddress.append(', ' + trAddress.innerHTML);
            ordersModalTimeLimit.innerHTML = trTimeLimit.innerHTML;
        }

        ordersModalContact.innerHTML = trContact.innerHTML;
        ordersModalInfo.innerHTML = trInfo.innerHTML;

    })




    // START ------------- settlements modal -------------

    const partnerSettlementsModal = document.querySelector('#partnerSettlementsModal');

    $(partnerSettlementsModal).on('show.bs.modal', function (e) {

        const tr = e.relatedTarget.closest('tr');
        const area = tr.closest('table').dataset.area;
        const trId = tr.id;
        const trOffer = tr.querySelector('[data-offer]');
        const trAddress = tr.querySelector('[data-address]');
        const trRealization = tr.querySelector('[data-realization]');
        const trBill = tr.querySelector('[data-bill]');
        const trComplaint = tr.querySelector('[data-complaint]');
        const trPayment = tr.querySelector('[data-payment]');

        const settlementsModalTitle = partnerSettlementsModal.querySelector('[data-title-id]');
        const settlementsModalId = partnerSettlementsModal.querySelector('[data-order]');
        const settlementsModalOffer = partnerSettlementsModal.querySelector('[data-offer]');
        const settlementsModalAddress = partnerSettlementsModal.querySelector('[data-address]');
        const settlementsModalRealization = partnerSettlementsModal.querySelector('[data-realization]');
        const settlementsModalBill = partnerSettlementsModal.querySelector('[data-bill]');
        const settlementsModalComplaint = partnerSettlementsModal.querySelector('[data-complaint]');
        const settlementsModalPayment = partnerSettlementsModal.querySelector('[data-payment]');

        settlementsModalTitle.innerHTML = trId;
        settlementsModalId.id = trId;

        if ( ('complaint' in e.relatedTarget.dataset) ) {

            settlementsModalOffer.closest('tr').style.display = 'none';
            settlementsModalAddress.closest('tr').style.display = 'none';
            settlementsModalRealization.closest('tr').style.display = 'none';
            settlementsModalPayment.closest('tr').style.display = 'none';

        } else {

            settlementsModalOffer.closest('tr').style.display = '';
            settlementsModalAddress.closest('tr').style.display = '';
            settlementsModalRealization.closest('tr').style.display = '';
            settlementsModalPayment.closest('tr').style.display = '';

            settlementsModalOffer.innerHTML = trOffer.innerHTML;
            settlementsModalAddress.innerHTML = area;
            settlementsModalAddress.append(', ' + trAddress.innerHTML);
            settlementsModalRealization.innerHTML = trRealization.innerHTML;
            settlementsModalPayment.innerHTML = trPayment.innerHTML;
        }

        settlementsModalBill.innerHTML = trBill.innerHTML;
        settlementsModalComplaint.innerHTML = trComplaint.innerHTML;

    })



    // START ------------- client order modal -------------

    const clientOrdersModal = document.querySelector('#clientOrdersModal');

    $(clientOrdersModal).on('show.bs.modal', function (e) {

        const tr = e.relatedTarget.closest('tr');
        const trId = tr.id;
        const trAdded = tr.querySelector('[data-added]');
        const trPayment = tr.querySelector('[data-payment]');
        const trTimeLimit = tr.querySelector('[data-time-limit]');
        const trStatus = tr.querySelector('[data-status]');
        const trBill = tr.querySelector('[data-bill]');
        const trComments = tr.querySelector('[data-comments]');

        const ordersModalTitle = clientOrdersModal.querySelector('[data-title-id]');
        const ordersModalId = clientOrdersModal.querySelector('[data-order]');
        const ordersModalAdded = clientOrdersModal.querySelector('[data-added]');
        const ordersModalPayment = clientOrdersModal.querySelector('[data-payment]');
        const ordersModalTimeLimit = clientOrdersModal.querySelector('[data-time-limit]');
        const ordersModalStatus = clientOrdersModal.querySelector('[data-status]');
        const ordersModalBill = clientOrdersModal.querySelector('[data-bill]');

        ordersModalTitle.innerHTML = trId;
        ordersModalId.id = trId;

        if ( ('info' in e.relatedTarget.dataset) ) {

            ordersModalAdded.closest('tr').style.display = 'none';
            ordersModalPayment.closest('tr').style.display = 'none';
            ordersModalTimeLimit.closest('tr').style.display = 'none';

        } else {

            ordersModalAdded.closest('tr').style.display = '';
            ordersModalPayment.closest('tr').style.display = '';
            ordersModalTimeLimit.closest('tr').style.display = '';

            ordersModalAdded.innerHTML = trAdded.innerHTML;
            ordersModalPayment.innerHTML = trPayment.innerHTML;
            ordersModalTimeLimit.innerHTML = trTimeLimit.innerHTML;
            ordersModalStatus.innerHTML = trStatus.innerHTML;
            ordersModalBill.innerHTML = trBill.innerHTML;
        }

        ordersModalBill.innerHTML = trBill.innerHTML;

    })



}, false);

function handleHeader() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.body.className = "sm";
    } else {
        document.body.className = "";
    }
}

// jQuery.fn.jquery
// $.fn.popover.Constructor.VERSION
// $.fn.hasAttr
