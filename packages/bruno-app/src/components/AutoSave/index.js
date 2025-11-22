import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import store from '../../providers/ReduxStore/';
import { sendRequest, saveRequest } from 'providers/ReduxStore/slices/collections/actions';
import { find } from 'lodash';
// import { saveRequest } from 'providers/ReduxStore/slices/collections/index';
export default function () {
  const activeTabUid = useSelector((state) => state.tabs.activeTabUid);
  const dataRef = useRef({
    prevTabData: {
      uid: null,
      collectionUid: null
    }
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fn = async () => {
      if (!activeTabUid) {
        return;
      }
      const fullState = store.getState();

      const { tabs, collections } = fullState;
      console.log('>>> collections: ', collections, ', tabs: ', tabs);

      const { prevTabData } = dataRef.current;
      if (prevTabData.uid) {
        dispatch(saveRequest(prevTabData.uid, prevTabData.collectionUid, true));
      }

      console.log('>>> activeTabUid: ', activeTabUid);

      const activeTab = find(tabs.tabs, (tab) => tab.uid === activeTabUid);

      console.log('>> active tab: ', activeTab);
      if (activeTab && activeTab.type === 'request') {
        console.log('>>> its request type tab');
        const prevTabData = dataRef.current.prevTabData;
        prevTabData.uid = activeTab.uid;
        prevTabData.collectionUid = activeTab.collectionUid;
      } else {
        console.log('>>> its not a request type tab');
      }

      // dispatch(saveRequest(prevTab.uid, prevTab.collectionUid));
    };
    fn();
  }, [activeTabUid]);
  return null;
}
