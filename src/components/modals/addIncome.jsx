import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import React from 'react'

function AddIncomeModal({open,onCancel, onFinish}) {
    const [form] = Form.useForm()
  return (
    <Modal
        title="Add Income"
        open={open}
        onCancel={onCancel}
        footer={null}
    >
        <Form
            form={form}
            layout='vertical'
            onFinish={(values) => {
                onFinish(values,"income")
                form.resetFields()
                onCancel()
            }}
        >
            <Form.Item 
                label="Name"
                name="name"
                rules={[
                    {required:true, message:"Please enter name"}
                ]}
            >
                <Input type='text' className='custom__input' />
            </Form.Item>

            <Form.Item 
                label="Amount"
                name="amount"
                rules={[
                    {required:true, message:"Please enter name"}
                ]}
            >
                <Input type='number' className='custom__input' />
            </Form.Item>

            <Form.Item
                label="Date"
                name="date"
                rules={[
                    {required:true, message:"Please select an income date !"}
                ]}
            >
                <DatePicker format="YYYY-MM-DD" className='custome__input' />
            </Form.Item>

            <Form.Item
                label="Tag"
                name="tag"
                rules={[
                    {required:true, message:"Please select an income date !"}
                ]}
            >
                <Select className='select__input'>
                    <Select.Option value="salary">Salary</Select.Option>
                    <Select.Option value="investment">Investment</Select.Option>
                    <Select.Option value="others">Others</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button className="btn" type='primary' htmlType='submit' >Add Income</Button>
            </Form.Item>
        </Form>
    </Modal>
  )
}

export default AddIncomeModal