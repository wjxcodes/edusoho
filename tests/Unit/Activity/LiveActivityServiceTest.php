<?php

namespace Tests\Unit\Activity;

use Biz\BaseTestCase;
use Biz\Activity\Service\LiveActivityService;

class LiveActivityServiceTest extends BaseTestCase
{
    public function testCreate()
    {
        $live = array(
            'title' => 'test live activity',
            'remark' => 'remark ...',
            'mediaType' => 'live',
            'fromCourseId' => 1,
            'fromCourseSetId' => 1,
            'fromUserId' => '1',
            'startTime' => time() + 1000,
            'endTime' => time() + 3000,
            'length' => 2000,
            '_base_url' => 'url...',
        );
        $savedActivity = $this->getLiveActivityService()->createLiveActivity($live);
        $this->assertNotNull($savedActivity['id']);
        $this->assertNotNull($savedActivity['liveId']);
        $this->assertNotNull($savedActivity['liveProvider']);
    }

    public function testUpdate()
    {
        $live = array(
            'title' => 'test live activity 2',
            'remark' => 'remark ...',
            'mediaType' => 'live',
            'fromCourseId' => 1,
            'fromCourseSetId' => 1,
            'fromUserId' => '1',
            'startTime' => time() + 1000,
            'endTime' => time() + 4000,
            'length' => 3,
        );
        $savedActivity = $this->getLiveActivityService()->createLiveActivity($live);
        $savedActivity = array_merge($savedActivity, $live);
        $savedActivity['startTime'] = time() + 2000;
        $savedActivity['endTime'] = time() + 5000;
        $updatedData = array('length' => 100, 'endTime' => time() + 100000);
        $updatedActivity = $this->getLiveActivityService()->updateLiveActivity($savedActivity['id'], $updatedData, $savedActivity);
        $this->assertEquals($savedActivity['liveId'], $updatedActivity['liveId']);
    }

    public function testDelete()
    {
        $live = array(
            'title' => 'test live activity 2',
            'remark' => 'remark ...',
            'mediaType' => 'live',
            'fromCourseId' => 1,
            'fromCourseSetId' => 1,
            'fromUserId' => '1',
            'startTime' => time() + 1000,
            'endTime' => time() + 4000,
            'length' => 3000,
            '_base_url' => 'url...',
        );
        $savedActivity = $this->getLiveActivityService()->createLiveActivity($live);
        $this->getLiveActivityService()->deleteLiveActivity($savedActivity['id']);
        $result = $this->getLiveActivityService()->getLiveActivity($savedActivity['id']);
        $this->assertNull($result);
    }

    public function testGetLiveActivity()
    {
        $this->mockBiz(
            'Activity:LiveActivityDao',
            array(
                array(
                    'functionName' => 'get',
                    'returnValue' => array('id' => 111, 'liveId' => 111),
                    'withParams' => array(1),
                ),
            )
        );
        $result = $this->getLiveActivityService()->getLiveActivity(1);

        $this->assertEquals(array('id' => 111, 'liveId' => 111), $result);
    }

    public function testFindLiveActivitiesByIds()
    {
        $this->mockBiz(
            'Activity:LiveActivityDao',
            array(
                array(
                    'functionName' => 'findByIds',
                    'returnValue' => array(array('id' => 111, 'liveId' => 111)),
                    'withParams' => array(array(1, 2)),
                ),
            )
        );

        $results = $this->getLiveActivityService()->findLiveActivitiesByIds(array(1, 2));

        $this->assertEquals(array(array('id' => 111, 'liveId' => 111)), $results);
    }

    public function testCreateLiveroom()
    {
        $this->mockBiz(
            'User:UserService',
            array(
                array(
                    'functionName' => 'getUser',
                    'returnValue' => array('id' => 111, 'nickname' => 'test'),
                    'withParams' => array(111),
                ),
            )
        );
        $liveRoom = $this->getLiveActivityService()->createLiveroom(array(
            'fromUserId' => 111,
            'remark' => 'test',
            'startTime' => 4541222,
            'length' => 2,
            'title' => 'test',
            'fromCourseId' => 12,
        ));
    }

    /**
     * @return LiveActivityService
     */
    protected function getLiveActivityService()
    {
        $service = $this->createService('Activity:LiveActivityService');
        //mock client
        $class = new \ReflectionClass(get_class($service));
        $clientProp = $class->getProperty('client');
        $clientProp->setAccessible(true);
        $clientProp->setValue($service, new MockEdusohoLiveClient());

        return $service;
    }
}

/*
Mock of Topxia\Service\Util\EdusohoLiveClient
 */
class MockEdusohoLiveClient
{
    public function __contruct()
    {
    }

    public function createLive($live)
    {
        return array(
            'id' => rand(1, 1000),
            'provider' => rand(1, 10),
        );
    }

    public function updateLive($live)
    {
        return $live;
    }

    public function deleteLive($id, $provider)
    {
        return array(
            'id' => $id,
            'provider' => $provider,
        );
    }
}
